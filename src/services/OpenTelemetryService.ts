import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

const provider = new WebTracerProvider({
  spanProcessors: [
    new BatchSpanProcessor(
      new OTLPTraceExporter({
          url: 'http://localhost:4319/v1/traces',
      })
    ),
  ],
});

provider.register();

registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
    new FetchInstrumentation({
      // Only propagate trace headers to YOUR OWN APIs
      propagateTraceHeaderCorsUrls: [
        /http:\/\/localhost:5000/i, 
        /http:\/\/localhost:4318/i, 
      ],
    }),
  ],
});

console.log('✅ OpenTelemetry initialized in browser');
