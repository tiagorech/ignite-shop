import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

export interface ProductProps {
    id: string
    name: string
    imageUrl: string
    price: string
    quantity: number
    defaultPriceId: string
}

interface ContextProps {
    children: React.ReactNode
}
const CartContext = createContext({} as PropsCart)

interface PropsCart {
    setDataCart: Dispatch<SetStateAction<ProductProps[]>>,
    dataCart: ProductProps[]
}

function CartProvider({children} : ContextProps){
    const [dataCart, setDataCart] = useState<ProductProps[]>([])

    return ( 
        <CartContext.Provider value={{setDataCart, dataCart}}>
            {children}
        </CartContext.Provider>)
}


function useCart(){
    const context = useContext(CartContext)
    return context
}

export {CartProvider, useCart}