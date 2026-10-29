import Link from "next/link";

export default function Home() {
return (
    <main>
        <h1>Esto es un ejemplo de pagina principal con next</h1>
        <p>
            <Link href="/practica/1">Ir a la pagina 1</Link>
        </p>
        <p>
            <Link href="/talleres">Ver talleres</Link> · <Link href="/perfil">Mi perfil</Link>
        </p>
    </main>
)
}
