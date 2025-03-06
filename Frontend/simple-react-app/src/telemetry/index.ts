import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export const initTelemetry = () => {
  const exporter = new OTLPTraceExporter({
    url: import.meta.env.VITE_JAEGER_COLLECTOR_URL || 'http://localhost:4318/v1/traces',
  });

  const provider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'simple-react-frontend',
    }),
  });

  provider.addSpanProcessor(new BatchSpanProcessor(exporter));

  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new FetchInstrumentation({
        clearTimingResources: true,
      }),
    ],
    tracerProvider: provider,
  });

  provider.register();

  return provider.getTracer('simple-react-frontend');
};
