import { useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock } from "lucide-react";
import { verifyPin } from "@/lib/shop.functions";
import { Button } from "./button";

const KEY = "bf-staff-pin";

/** Staff-only gate. The PIN is re-checked on the server for every action. */
export function PinGate({ title, children }: { title: string; children: (pin: string, logout: () => void) => ReactNode }) {
  const [pin, setPin] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const verify = useServerFn(verifyPin);
  useEffect(() => { setPin(sessionStorage.getItem(KEY)); }, []);
  const logout = () => { sessionStorage.removeItem(KEY); setPin(null); };
  if (pin) return <>{children(pin, logout)}</>;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    try { await verify({ data: { pin: value } }); sessionStorage.setItem(KEY, value); setPin(value); }
    catch { setError("PIN incorreto."); }
  };
  return (
    <section className="staff-gate">
      <form onSubmit={submit} className="staff-gate-card">
        <Lock aria-hidden="true" />
        <span className="eyebrow">Espaço reservado</span>
        <h1>{title}</h1>
        <label>PIN de acesso<input type="password" inputMode="numeric" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} required /></label>
        {error && <p className="staff-error" role="alert">{error}</p>}
        <Button type="submit" tone="gold" arrow>Entrar</Button>
      </form>
    </section>
  );
}
