import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7A1F2A] mb-2">
          Federación Madrileña de Karate
        </p>
        <h1
          className="text-4xl font-bold text-[#191C1D] mb-4"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          FMK Grados
        </h1>
        <p className="text-sm text-[#54585B] mb-8">
          Sistema de Gestión de Exámenes de Grado
        </p>
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full h-12 rounded bg-[#7A1F2A] text-white text-sm font-bold flex items-center justify-center hover:bg-[#5B0616] transition"
          >
            Acceder al sistema
          </Link>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Link href="/admin" className="block py-2 rounded border border-[#7A1F2A]/30 bg-[#F8E9EB] text-[#7A1F2A] text-xs font-bold text-center hover:bg-[#F8E9EB]/80 transition">
              Admin (demo)
            </Link>
            <Link href="/estudiante" className="block py-2 rounded border border-[#2D6A4F]/30 bg-[#EAF5EF] text-[#2D6A4F] text-xs font-bold text-center hover:bg-[#EAF5EF]/80 transition">
              Estudiante (demo)
            </Link>
            <Link href="/aspirante" className="block py-2 rounded border border-[#54585B]/30 bg-[#EEF0F1] text-[#54585B] text-xs font-bold text-center hover:bg-[#EEF0F1]/80 transition">
              Aspirante (demo)
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
