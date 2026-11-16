import Link from "next/link";
import estilos from '../styles/Inicio.module.css';

export default function Home() {
  return (
    <main className={estilos.inicio}>
      <section className={estilos.hero}>
        <p className={estilos.sobrelinea}>CECyT 9 · Comunidad de aprendizaje</p>
        <div className={estilos.acciones}>
          <Link className={estilos.primario} href="/talleres">Explorar talleres</Link>
          <Link className={estilos.secundario} href="/perfil">Consultar mi perfil</Link>
        </div>
      </section>

      <section className={estilos.seccion} aria-labelledby="como-funciona">
        <p className={estilos.sobrelinea}>Todo en un mismo lugar</p>
        <h2 id="como-funciona">Encuentra tu próximo taller</h2>
        <div className={estilos.tarjetas}>
          <article className={estilos.tarjeta}>
            <span className={estilos.numero}>01</span>
            <h3>Descubre</h3>
            <p>Revisa fechas, instructores y cupo de los próximos talleres.</p>
          </article>
          <article className={estilos.tarjeta}>
            <span className={estilos.numero}>02</span>
            <h3>Inscríbete</h3>
            <p>Registra tu nombre y boleta para reservar un lugar.</p>
          </article>
          <article className={estilos.tarjeta}>
            <span className={estilos.numero}>03</span>
            <h3>Consulta</h3>
            <p>Busca tus inscripciones con tu boleta desde tu perfil.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
