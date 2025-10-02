import { useEffect, useMemo, useState } from "react";
import { getModels } from "../services/OpenRouterService";
import type { OpenRouterModel } from "../services/OpenRouterService";

export function useModelSelector() {
  const [availableModels, setAvailableModels] = useState<OpenRouterModel[]>([]);
  const [model, setModel] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log("hook invoked");
  
  useEffect(() => {
    let mounted = true;
    console.log("fetching models...");
    (async () => {
      try {
        setLoading(true);
        const models = await getModels();
        console.log("models response: ", models);
        if (!mounted) return;
        setAvailableModels(models);
        if (models.length > 0) setModel(models[0].id);
      } catch (e: any) {
        console.error("error fetching models", e);
        if (!mounted) return;
        setError(e?.message || "Failed to load models");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);
  

  const state = useMemo(() => ({ model, setModel, availableModels, loading, error }), [model, availableModels, loading, error]);
  return state;
}