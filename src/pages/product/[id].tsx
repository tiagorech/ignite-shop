import { useCart } from "@/hooks/useCart"
import { stripe } from "@/lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product"
import { Skeleton } from "@radix-ui/themes"
import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import Stripe from "stripe"

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {
  const { dataCart, setDataCart } = useCart()

    function handleAddProduct() {
      const isProductInCart = dataCart.some((item) => item.id === product.id)

      if (!isProductInCart) {
        setDataCart((prevState) => [{ ...product, quantity: 1 }, ...prevState])
      } else {
        setDataCart((prevState) => 
          prevState.map((data) => {
            if (data.id === product.id) {
              return { ...data, quantity: data.quantity + 1 }
            }
            return data
          })
        )
      }
    }

    const { isFallback } = useRouter()
    if (isFallback) {
      return (
        <ProductContainer>
          <ImageContainer>
            <Skeleton width="100%" height="480px" />
          </ImageContainer>
    
          <ProductDetails>
            <Skeleton width="60%" height="32px" />
            <Skeleton width="30%" height="24px" />
            <Skeleton height="80px" width="100%" />
    
            <Skeleton width="160px" height="40px" style={{ borderRadius: "8px" }} />
          </ProductDetails>
        </ProductContainer>
      )
    }

  return (
    <>
      <Head>
      <title>{`${product.name} | Ignite Shop`}</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" priority />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>      
          <button onClick={handleAddProduct}>
            Colocar na sacola
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_SCDaMygF1KvRzD' } },
      { params: { id: 'prod_SDLNFGwVQC6OgQ' } }
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params?.id ?? '';

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format((price.unit_amount ?? 0) / 100),
        description: product.description,
        defaultPriceId: price.id
      }
    },
    revalidate: 60 * 60 * 2 
  }
}