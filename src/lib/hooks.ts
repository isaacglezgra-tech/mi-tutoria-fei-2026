import { useEffect, useState } from "react";
import { useApp } from "./store";
import { t, type MsgKey } from "./i18n";

export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

export function useT() {
  const lang = useApp((s) => s.lang);
  return (key: MsgKey) => t(lang, key);
}
