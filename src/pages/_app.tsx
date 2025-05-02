import { globalStyles } from "@/styles/global"
import { AppProps } from "next/app"
import { Header } from '@/components/header'
import * as Dialog from '@radix-ui/react-dialog'

import { Container } from "@/styles/pages/app";
import { CartProvider } from "@/hooks/useCart";
import Head from "next/head";

globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return (
  <Dialog.Root>
  <CartProvider>
  <Container>
    <Head>
        <title>Ignite Shop</title>
    </Head>
    <Header />
    <Component {...pageProps} />
    
  </Container>
  </CartProvider>
  </Dialog.Root>
  )
}
