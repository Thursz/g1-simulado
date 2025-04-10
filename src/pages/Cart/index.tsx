import { Fragment, useEffect, useState } from 'react'
import { Trash } from '@phosphor-icons/react'

import { QuantityInput } from '../../components/Form/QuantityInput'
import { Loading } from '../../components/Form/Loading/loading';

import {
  CartTotal,
  CartTotalInfo,
  CheckoutButton,
  Coffee,
  CoffeeInfo,
  Container,
  InfoContainer,
} from './styles'
import { Tags } from '../../components/CoffeeCard/styles'

interface CoffeeInCart {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  image: string;
  quantity: number;
  subTotal: number;
}

const DELIVERY_PRICE = 3.75;

export function Cart() {
  const [isLoading, setIsLoading] = useState(true);
  const [coffeesInCart, setCoffeesInCart] = useState<CoffeeInCart[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoffeesInCart([
        {
          id: "0",
          title: "Expresso Tradicional",
          description: "O tradicional café feito com água quente e grãos moídos",
          tags: ["tradicional", "gelado"],
          price: 6.90,
          image: "/images/coffees/expresso.png",
          quantity: 1,
          subTotal: 6.90,
        },
        {
          id: "1",
          title: "Expresso Americano",
          description: "Expresso diluído, menos intenso que o tradicional",
          tags: ["tradicional", "com leite"],
          price: 9.95,
          image: "/images/coffees/americano.png",
          quantity: 2,
          subTotal: 19.90,
        },
        {
          id: "2",
          title: "Expresso Cremoso",
          description: "Café expresso tradicional com espuma cremosa",
          tags: ["especial"],
          price: 16.50,
          image: "/images/coffees/expresso-cremoso.png",
          quantity: 3,
          subTotal: 49.50,
        }
      ]);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  function handleItemIncrement(itemId: string) {
    setCoffeesInCart((prev) =>
      prev.map((coffee) =>
        coffee.id === itemId
          ? {
              ...coffee,
              quantity: coffee.quantity + 1,
              subTotal: (coffee.quantity + 1) * coffee.price,
            }
          : coffee
      )
    );
  }

  function handleItemDecrement(itemId: string) {
    setCoffeesInCart((prev) =>
      prev.map((coffee) =>
        coffee.id === itemId && coffee.quantity > 1
          ? {
              ...coffee,
              quantity: coffee.quantity - 1,
              subTotal: (coffee.quantity - 1) * coffee.price,
            }
          : coffee
      )
    );
  }

  function handleItemRemove(itemId: string) {
    setCoffeesInCart((prev) => prev.filter((coffee) => coffee.id !== itemId));
  }

  const amountTags: string[] = []
  coffeesInCart.forEach(coffee => {
    coffee.tags.forEach(tag => {
      if (!amountTags.includes(tag)) amountTags.push(tag)
    })
  });

  const totalItemsPrice = coffeesInCart.reduce((acc, coffee) => acc + coffee.subTotal, 0)

  if (isLoading) return <Loading />

  return (
    <Container>
      <InfoContainer>
        <h2>Cafés selecionados</h2>

        <CartTotal>
          {coffeesInCart.map((coffee) => (
            <Fragment key={coffee.id}>
              <Coffee>
                <div>
                  <img src={coffee.image} alt={coffee.title} />

                  <div>
                    <span>{coffee.title}</span>
                    <Tags>
                      {coffee.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </Tags>

                    <CoffeeInfo>
                      <QuantityInput
                        quantity={coffee.quantity}
                        incrementQuantity={() => handleItemIncrement(coffee.id)}
                        decrementQuantity={() => handleItemDecrement(coffee.id)}
                      />

                      <button onClick={() => handleItemRemove(coffee.id)}>
                        <Trash />
                        <span>Remover</span>
                      </button>
                    </CoffeeInfo>
                  </div>
                </div>

                <aside>R$ {coffee.subTotal.toFixed(2)}</aside>
              </Coffee>

              <span />
            </Fragment>
          ))}

          <CartTotalInfo>
            <div>
              <span>Total de itens</span>
              <span>{totalItemsPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>

            <div>
              <span>Entrega</span>
              <span>{DELIVERY_PRICE.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>

            <div>
              <span>Total</span>
              <span>{(totalItemsPrice + DELIVERY_PRICE * amountTags.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </CartTotalInfo>

          <CheckoutButton type="submit" form="order">
            Confirmar pedido
          </CheckoutButton>
        </CartTotal>
      </InfoContainer>
    </Container>
  )
}
