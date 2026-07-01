#!/usr/bin/env bash
# ==============================================================================
# Smoke Test E2E — FocoCero (namespace: fococero)
# Ejecutar:  chmod +x smoke-test.sh && ./smoke-test.sh
# Requisitos: kubectl, jq, aws-cli (si no hay kubeconfig)
# ==============================================================================
set -euo pipefail

NS="fococero"
PASS=0
FAIL=0

report() {
  local service="$1" status="$2" connectivity="$3" notes="$4"
  printf "│ %-22s │ %-10s │ %-30s │ %-30s │\n" "$service" "$status" "$connectivity" "$notes"
}

header() {
  printf "┌────────────────────────┬────────────┬──────────────────────────────────┬──────────────────────────────────┐\n"
  printf "│ %-22s │ %-10s │ %-30s │ %-30s │\n" "Servicio" "Estado" "Conectividad" "Observaciones"
  printf "├────────────────────────┼────────────┼──────────────────────────────────┼──────────────────────────────────┤\n"
}

footer() {
  printf "└────────────────────────┴────────────┴──────────────────────────────────┴──────────────────────────────────┘\n"
}

check_k8s() {
  if ! kubectl get ns "$NS" &>/dev/null; then
    echo "[ERROR] Namespace '$NS' no existe. Abortando."
    exit 1
  fi
}

# ──────────────────────────────────────────────────────────────────────────────
# TEST 1: Resiliencia de Nodos
# ──────────────────────────────────────────────────────────────────────────────
test_pod_health() {
  echo ""
  echo "╔══════════════════════════════════════════════════════════════════════╗"
  echo "║  TEST 1: RESILIENCIA DE NODOS                                       ║"
  echo "╚══════════════════════════════════════════════════════════════════════╝"

  header
  local pods
  pods=$(kubectl get pods -n "$NS" --no-headers 2>/dev/null) || {
    echo "│ ERROR: No se pudo listar pods                                       │"
    return
  }

  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    name=$(echo "$line" | awk '{print $1}')
    ready=$(echo "$line" | awk '{print $2}')
    status=$(echo "$line" | awk '{print $3}')
    restarts=$(echo "$line" | awk '{print $4}')

    if [[ "$status" == "Running" && "$ready" == "1/1" ]]; then
      report "$name" "✅ Running" "READY $ready" "Restarts: $restarts"
      ((PASS++))
    elif [[ "$status" == "Running" ]]; then
      report "$name" "⚠️  Degraded" "READY $ready" "Restarts: $restarts"
      ((FAIL++))
    else
      # Diagnosticar pods fallidos
      node=$(kubectl get pod "$name" -n "$NS" -o jsonpath='{.spec.nodeName}' 2>/dev/null || echo "N/A")
      events=$(kubectl describe pod "$name" -n "$NS" 2>/dev/null | grep -A5 "Events:" | tail -5 | tr -d '\n' | cut -c1-60)
      report "$name" "❌ $status" "Nodo: $node" "$events"
      ((FAIL++))
    fi
  done <<< "$pods"
  footer
}

# ──────────────────────────────────────────────────────────────────────────────
# TEST 2: Conectividad Interna (DNS & Network)
# ──────────────────────────────────────────────────────────────────────────────
test_internal_connectivity() {
  echo ""
  echo "╔══════════════════════════════════════════════════════════════════════╗"
  echo "║  TEST 2: CONECTIVIDAD INTERNA (DNS & NETWORK)                      ║"
  echo "╚══════════════════════════════════════════════════════════════════════╝"

  # Buscar un pod de api-gateway o cualquier pod para hacer el test
  GATEWAY_POD=$(kubectl get pods -n "$NS" -l app=fococero,tier=frontend --no-headers 2>/dev/null | head -1 | awk '{print $1}')

  if [[ -z "$GATEWAY_POD" ]]; then
    echo "│ ⚠️  No se encontró pod para ejecutar pruebas de red                    │"
    ((FAIL++))
    return
  fi

  local services=(
    "ms-auth:3001"
    "ms-reportes:3004"
    "ms-alertas:3003"
  )

  header
  for svc_port in "${services[@]}"; do
    svc="${svc_port%%:*}"
    port="${svc_port##*:}"
    fqdn="${svc}.${NS}.svc.cluster.local"

    # Test DNS resolution
    dns_ok=$(kubectl exec "$GATEWAY_POD" -n "$NS" -- nslookup "$fqdn" 2>/dev/null | grep -c "Name:" || true)

    # Test TCP connectivity via nc
    nc_ok=$(kubectl exec "$GATEWAY_POD" -n "$NS" -- sh -c "echo '' | nc -zv -w3 $svc $port 2>&1" || echo "FAILED")

    if echo "$nc_ok" | grep -qi "succeeded"; then
      report "$svc:$port" "✅ Alcanzable" "DNS: OK | TCP: OK" ""
      ((PASS++))
    elif [[ "$dns_ok" -gt 0 ]]; then
      report "$svc:$port" "⚠️  DNS OK, TCP fail" "$nc_ok" "Firewall / NetworkPolicy?"
      ((FAIL++))
    else
      report "$svc:$port" "❌ Inalcanzable" "DNS: FAIL | TCP: FAIL" "Revisar Service y DNS"
      ((FAIL++))
    fi
  done
  footer
}

# ──────────────────────────────────────────────────────────────────────────────
# TEST 3: Seguridad e Integridad de Secretos
# ──────────────────────────────────────────────────────────────────────────────
test_security() {
  echo ""
  echo "╔══════════════════════════════════════════════════════════════════════╗"
  echo "║  TEST 3: SEGURIDAD E INTEGRIDAD DE SECRETOS                        ║"
  echo "╚══════════════════════════════════════════════════════════════════════╝"

  header

  # 3a. Verificar variables de Firebase en api-gateway
  GATEWAY_POD=$(kubectl get pods -n "$NS" -l app=fococero,tier=frontend --no-headers 2>/dev/null | head -1 | awk '{print $1}')

  if [[ -n "$GATEWAY_POD" ]]; then
    fb_project=$(kubectl exec "$GATEWAY_POD" -n "$NS" -- sh -c 'echo $EXPO_PUBLIC_FIREBASE_PROJECT_ID' 2>/dev/null)
    fb_client=$(kubectl exec "$GATEWAY_POD" -n "$NS" -- sh -c 'echo $EXPO_PUBLIC_FIREBASE_CLIENT_ID' 2>/dev/null)

    if [[ -n "$fb_project" && -n "$fb_client" ]]; then
      report "Firebase Envs" "✅ Inyectadas" "PROJECT_ID: $fb_project" "CLIENT_ID presente"
      ((PASS++))
    else
      report "Firebase Envs" "❌ Faltan vars" "PROJECT_ID: ${fb_project:-vacío}" "CLIENT_ID: ${fb_client:-vacío}"
      ((FAIL++))
    fi
  fi

  # 3b. Test /health → debe responder 401 Unauthorized (middleware activo)
  local secured_services=("ms-reportes" "ms-alertas")
  for svc in "${secured_services[@]}"; do
    # Buscar IP del Service
    svc_ip=$(kubectl get svc "$svc" -n "$NS" -o jsonpath='{.spec.clusterIP}' 2>/dev/null || true)
    svc_port=$(kubectl get svc "$svc" -n "$NS" -o jsonpath='{.spec.ports[0].port}' 2>/dev/null || echo "80")

    if [[ -z "$svc_ip" ]]; then
      report "$svc:/health" "⚠️  Sin Service" "ClusterIP no encontrado" "¿Service creado?"
      ((FAIL++))
      continue
    fi

    if [[ -n "$GATEWAY_POD" ]]; then
      http_code=$(kubectl exec "$GATEWAY_POD" -n "$NS" -- sh -c "wget -q -O- --server-response --timeout=5 http://${svc_ip}:${svc_port}/health 2>&1 | head -1 | awk '{print \$2}'" 2>/dev/null || echo "000")

      if [[ "$http_code" == "401" ]]; then
        report "$svc:/health" "✅ 401 Unauthorized" "Middleware activo" "Respuesta esperada"
        ((PASS++))
      elif [[ "$http_code" == "200" ]]; then
        report "$svc:/health" "❌ 200 OK (inseguro)" "Middleware NO protege" "¡Riesgo de seguridad!"
        ((FAIL++))
      else
        report "$svc:/health" "⚠️  Código $http_code" "Inesperado" "Revisar ruta /health"
        ((FAIL++))
      fi
    fi
  done
  footer
}

# ──────────────────────────────────────────────────────────────────────────────
# TEST 4: Configuración del Frontend
# ──────────────────────────────────────────────────────────────────────────────
test_frontend_config() {
  echo ""
  echo "╔══════════════════════════════════════════════════════════════════════╗"
  echo "║  TEST 4: CONFIGURACIÓN DEL FRONTEND                                ║"
  echo "╚══════════════════════════════════════════════════════════════════════╝"

  header
  FRONTEND_POD=$(kubectl get pods -n "$NS" -l app=fococero,tier=frontend --no-headers 2>/dev/null | head -1 | awk '{print $1}')

  if [[ -z "$FRONTEND_POD" ]]; then
    report "Frontend" "❌ Sin pods" "No disponible" ""
    ((FAIL++))
    footer
    return
  fi

  # 4a. Verificar ConfigMap montado
  cm_mount=$(kubectl exec "$FRONTEND_POD" -n "$NS" -- sh -c 'mount | grep fococero-config' 2>/dev/null || echo "")

  if [[ -n "$cm_mount" ]]; then
    report "ConfigMap" "✅ Montado" "$(echo "$cm_mount" | awk '{print $3}')" ""
    ((PASS++))
  else
    report "ConfigMap" "❌ No montado" "Revisar volumes en deployment" ""
    ((FAIL++))
  fi

  # 4b. Petición GET a la raíz del frontend → 200 OK + contenido estático
  frontend_ip=$(kubectl get pods "$FRONTEND_POD" -n "$NS" -o jsonpath='{.status.podIP}' 2>/dev/null || true)

  if [[ -n "$frontend_ip" ]]; then
    http_code=$(kubectl exec "$FRONTEND_POD" -n "$NS" -- sh -c "wget -q -O- --server-response --timeout=5 http://localhost:80/ 2>&1 | head -1 | awk '{print \$2}'" 2>/dev/null || echo "000")

    if [[ "$http_code" == "200" ]]; then
      report "Frontend HTTP" "✅ 200 OK" "Contenido estático servido" ""
      ((PASS++))
    else
      report "Frontend HTTP" "❌ HTTP $http_code" "Nginx no responde" "Revisar liveness/readiness"
      ((FAIL++))
    fi
  else
    report "Frontend HTTP" "❌ Sin IP" "Pod no tiene IP asignada" ""
    ((FAIL++))
  fi
  footer
}

# ──────────────────────────────────────────────────────────────────────────────
# EJECUCIÓN
# ──────────────────────────────────────────────────────────────────────────────
clear
echo ""
echo "  ███████╗ ██████╗  ██████╗ ██████╗ ██████╗ ██████╗ ██████╗  "
echo "  ██╔════╝██╔════╝ ██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝  "
echo "  █████╗  ██║      ██║     ██║     ██║     ██║     ██║       "
echo "  ██╔══╝  ██║      ██║     ██║     ██║     ██║     ██║       "
echo "  ██║     ╚██████╗ ╚██████╗╚██████╗╚██████╗╚██████╗╚██████╗  "
echo "  ╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚═════╝  "
echo "  ─── Smoke Test E2E — Namespace: ${NS} ───"
echo ""

check_k8s

test_pod_health
test_internal_connectivity
test_security
test_frontend_config

# ──────────────────────────────────────────────────────────────────────────────
# REPORTE FINAL CONSOLIDADO
# ──────────────────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                        RESUMEN FINAL                               ║"
echo "╠══════════════════════════════════════════════════════════════════════╣"
TOTAL=$((PASS + FAIL))
printf "║  Pruebas Pasadas:  %-2d  /  %-2d                                  ║\n" "$PASS" "$TOTAL"
printf "║  Pruebas Falladas: %-2d                                           ║\n" "$FAIL"
if [[ "$FAIL" -eq 0 ]]; then
  echo "║  ✅ ESTADO: TODAS LAS PRUEBAS PASARON                              ║"
else
  echo "║  ❌ ESTADO: SE DETECTARON FALLOS — Revisar observaciones           ║"
fi
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

exit $FAIL
