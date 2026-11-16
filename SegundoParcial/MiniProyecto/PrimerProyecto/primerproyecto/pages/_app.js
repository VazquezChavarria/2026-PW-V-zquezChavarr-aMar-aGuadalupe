import Menu from '../components/Menu';
import Head from 'next/head';
import '../styles/style.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Talleres CECyT 9</title>
        <meta
          name="description"
          content="Explora talleres, consulta lugares e inscríbete en actividades de CECyT 9."
        />
      </Head>
      <Menu />
      <Component {...pageProps} />
    </>
  );
}