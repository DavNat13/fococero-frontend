import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { initializeApp, getApps, FirebaseOptions } from 'firebase/app';

interface TestResult {
  name: string;
  status: 'pending' | 'passed' | 'failed';
  message: string;
}

type TestStatus = 'running' | 'completed';

const INITIAL_RESULTS: TestResult[] = [
  { name: 'Variables de Entorno', status: 'pending', message: 'Verificando...' },
  { name: 'Inicialización de Firebase', status: 'pending', message: 'Verificando...' },
  { name: 'Conectividad al Backend', status: 'pending', message: 'Verificando...' },
];

export default function InfrastructureTest() {
  const [results, setResults] = useState<TestResult[]>(INITIAL_RESULTS);
  const [status, setStatus] = useState<TestStatus>('running');

  const updateResult = useCallback((index: number, update: Partial<TestResult>) => {
    setResults((prev) => prev.map((r, i) => (i === index ? { ...r, ...update } : r)));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runTests() {
      // ── Test 1: Validación de variables de entorno ──
      const apiUrl = process.env.EXPO_PUBLIC_API_GATEWAY_URL;
      const firebaseProjectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;

      if (apiUrl && firebaseProjectId) {
        console.log('[InfrastructureTest] ✅ Variables de entorno OK');
        if (!cancelled)
          updateResult(0, {
            status: 'passed',
            message: `API Gateway: ${apiUrl}`,
          });
      } else {
        const missing: string[] = [];
        if (!apiUrl) missing.push('EXPO_PUBLIC_API_GATEWAY_URL');
        if (!firebaseProjectId) missing.push('EXPO_PUBLIC_FIREBASE_PROJECT_ID');
        console.error('[InfrastructureTest] ❌ Faltan variables:', ...missing);
        if (!cancelled)
          updateResult(0, {
            status: 'failed',
            message: `Faltan: ${missing.join(', ')}`,
          });
      }

      // ── Test 2: Inicialización de Firebase ──
      try {
        const firebaseConfig: FirebaseOptions = {
          apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: firebaseProjectId,
          storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        };

        const existingApps = getApps();
        const app =
          existingApps.find((a) => a.name === '[DEFAULT]') ?? initializeApp(firebaseConfig);

        console.log('[InfrastructureTest] ✅ Firebase initialized:', app.name);
        if (!cancelled)
          updateResult(1, {
            status: 'passed',
            message: `App: ${app.name}`,
          });
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error desconocido';
        console.error('[InfrastructureTest] ❌ Firebase init failed:', msg);
        if (!cancelled) updateResult(1, { status: 'failed', message: msg });
      }

      // ── Test 3: Conectividad al Backend ──
      try {
        const response = await fetch(apiUrl!, { method: 'HEAD' });
        console.log('[InfrastructureTest] ✅ Backend responded:', response.status);
        if (!cancelled)
          updateResult(2, {
            status: 'passed',
            message: `HTTP ${response.status}`,
          });
      } catch (error) {
        let msg = 'Error de conexión';
        if (error instanceof TypeError) {
          msg = 'Error de red — posible bloqueo ATS/Cleartext Traffic en iOS/Android';
        } else if (error instanceof Error) {
          msg = error.message;
        }
        console.error('[InfrastructureTest] ❌ Backend unreachable:', msg);
        if (!cancelled) updateResult(2, { status: 'failed', message: msg });
      }

      if (!cancelled) setStatus('completed');
    }

    runTests();

    return () => {
      cancelled = true;
    };
  }, [updateResult]);

  const passed = results.filter((r) => r.status === 'passed').length;
  const total = results.length;

  const statusIcon = (s: TestResult['status']) => {
    switch (s) {
      case 'passed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '⏳';
    }
  };

  const statusBorder = (s: TestResult['status']) => {
    switch (s) {
      case 'passed':
        return 'border-[#22C55E]';
      case 'failed':
        return 'border-[#EF4444]';
      default:
        return 'border-[#3B3F52]';
    }
  };

  const statusText = (s: TestResult['status']) => {
    switch (s) {
      case 'passed':
        return 'text-[#22C55E]';
      case 'failed':
        return 'text-[#EF4444]';
      default:
        return 'text-[#9CA3AF]';
    }
  };

  return (
    <View className="flex-1 bg-[#0C0F17]">
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="mb-10 items-center">
          <Text className="text-3xl font-bold tracking-wider text-white">IronHealth</Text>
          <Text className="mt-1 text-sm uppercase tracking-widest text-[#FF6B35]">Diagnostics</Text>
          <View className="mt-4 h-px w-16 bg-[#FF6B35]" />
        </View>

        {/* Loading indicator */}
        {status === 'running' && (
          <View className="mb-8 items-center">
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text className="mt-3 text-sm text-[#9CA3AF]">
              Ejecutando pruebas de infraestructura...
            </Text>
          </View>
        )}

        {/* Test results */}
        <View className="gap-4">
          {results.map((test) => (
            <View
              key={test.name}
              className={`rounded-xl border bg-[#1A1F2E] p-4 ${statusBorder(test.status)}`}
            >
              <View className="flex-row items-center justify-between">
                <View className="mr-2 flex-1 flex-row items-center">
                  <Text className="mr-2 text-base">{statusIcon(test.status)}</Text>
                  <Text className="text-base font-semibold text-white">{test.name}</Text>
                </View>
                {test.status === 'pending' && <ActivityIndicator size="small" color="#9CA3AF" />}
              </View>
              <Text className={`ml-8 mt-1 text-sm ${statusText(test.status)}`} numberOfLines={2}>
                {test.message}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        {status === 'completed' && (
          <View className="mt-8 items-center">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-white">
                {passed === total
                  ? '✅ Todas las pruebas pasaron'
                  : `⚠️ ${passed}/${total} pruebas pasaron`}
              </Text>
            </View>
            <Text className="mt-1 text-sm text-[#6B7280]">
              {passed === total ? 'Entorno listo para desarrollo' : 'Revisa los errores en consola'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
