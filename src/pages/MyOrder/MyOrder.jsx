import { Container } from './styles';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ButtonText } from '../../components/ButtonText/Index';
import { Button } from '../../components/Button';

import { MdKeyboardArrowLeft } from 'react-icons/md';

import img from '../../assets/cafe.png';

import { useNavigate } from 'react-router-dom';

import { api } from '../../service/api';

import { useParams } from 'react-router-dom';

import { useState, useEffect } from 'react';

import { useAuth } from '../../hooks/auth';

import qrcode from '../../assets/qrcode.svg';

function MyOrder() {
  const navigate = useNavigate();
  const params = useParams();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState();

  const { user } = useAuth();

  let totals = 0;
  let waitingPayment = document.querySelector('#waitingPayment');
  let pix = document.querySelector('#pix');
  let creditCard = document.querySelector('#qrcodeOrCredit');

  let avatarURL = `${api.defaults.baseURL}/files`;

  function home() {
    navigate('/');
  }

  function selectPix() {
    pix.classList.remove('hide');
    waitingPayment.classList.add('hide');
    creditCard.classList.add('hide');
  }
  function selectCreditCard() {
    pix.classList.add('hide');
    waitingPayment.classList.add('hide');
    creditCard.classList.remove('hide');
  }

  async function deleteItem(item) {
    await api.delete(`/order/${user.id}/${item}`);
    // navigate(`/myOrder/${user.id}`);
    window.location.reload(true);
  }

  useEffect(() => {
    async function fetchOrder() {
      const response = await api.get(`/order/${params.id}`);
      setData(response.data);

      let array = response.data;
      const sumPrice = array.map(value => value.total);
      for (let i = 0; i < sumPrice.length; i++) {
        totals = totals + Number(sumPrice[i]);

        // totals = Number(totals + sumPrice[i]);
      }
      setTotal(totals.toFixed(2).replace('.', ','));
      // alert(totals);
    }

    fetchOrder();
  }, [data]);

  return (
    <Container>
      <Header />

      <main>
        <div className="page">
          <Button
            icon={MdKeyboardArrowLeft}
            text="Voltar"
            className="back"
            onClick={home}
          />
          <div className="myOrder">
            <h3>Meu pedido</h3>
            <ul>
              {data &&
                data.map(order => (
                  <li key={String(order.id)}>
                    <img
                      src={`${avatarURL}/${order.image}`}
                      alt="imagem do pedido"
                    />
                    <div className="nameAndDelete">
                      <div>
                        <p>{order.quantity}x</p>
                        <p>{order.name}</p>
                        {/* <p>1x Café expresso</p> */}
                        <span>R$ {order.total}</span>
                      </div>
                      <ButtonText
                        text="Excluir"
                        onClick={() => deleteItem(order.id)}
                      />
                      {/* <div className="total">
                        <span id="total">Total:{totals}</span>
                      </div> */}
                    </div>
                  </li>
                ))}
              <span className="totals">Total: R${total}</span>
            </ul>
          </div>
          <div className="payment">
            <h3>Pagamento</h3>
            <div className="options">
              <button className="pix" id="qrcode" onClick={selectPix}>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.9778 18.5353L15.978 18.5355C16.4223 18.9796 16.9442 19.3203 17.5127 19.545L14.3323 22.7255C13.2989 23.7588 11.6235 23.7588 10.5903 22.7255L10.5903 22.7255L7.49699 19.6323C8.14385 19.4119 8.73705 19.0447 9.23337 18.5486L9.23355 18.5485L12.6122 15.1697L15.9778 18.5353Z"
                    stroke="white"
                    stroke-width="2"
                  />
                  <path
                    d="M17.5126 5.45499C16.9441 5.67967 16.4222 6.02044 15.9779 6.46451L15.9777 6.46471L12.612 9.83069L9.23352 6.45157L9.23329 6.45134C8.73701 5.9553 8.14386 5.58815 7.49705 5.36773L10.5902 2.27458L10.5902 2.27455C11.6234 1.24125 13.2988 1.24116 14.3323 2.27457C14.3323 2.27458 14.3323 2.2746 14.3324 2.27461L17.5126 5.45499ZM12.377 10.0657C12.3773 10.0654 12.3776 10.0651 12.378 10.0648L12.377 10.0657ZM12.8465 10.0652L12.8464 10.0651C12.8464 10.0651 12.8465 10.0652 12.8465 10.0652Z"
                    stroke="white"
                    stroke-width="2"
                  />
                  <mask id="path-3-inside-1_1_140" fill="white">
                    <path d="M23.3933 9.92194L20.6304 7.15898C20.5696 7.18334 20.5037 7.19855 20.4341 7.19855H19.1779C18.5284 7.19855 17.8926 7.46198 17.4337 7.92124L13.8341 11.521C13.4972 11.8578 13.0546 12.0264 12.6124 12.0264C12.1697 12.0264 11.7274 11.8578 11.3907 11.5213L7.77747 7.90808C7.31854 7.44872 6.68277 7.1854 6.0333 7.1854H4.48863C4.42274 7.1854 4.36118 7.16987 4.30306 7.14798L1.52911 9.92194C0.105205 11.3458 0.105205 13.6543 1.52911 15.0782L4.30294 17.8521C4.36117 17.8302 4.42274 17.8146 4.48863 17.8146H6.0333C6.68277 17.8146 7.31854 17.5513 7.77747 17.0921L11.3903 13.4792C12.0434 12.8267 13.1817 12.8265 13.8341 13.4795L17.4337 17.0789C17.8926 17.5381 18.5284 17.8016 19.1779 17.8016H20.4341C20.5037 17.8016 20.5696 17.8168 20.6304 17.8412L23.3933 15.0782C24.8171 13.6543 24.8171 11.3458 23.3933 9.92192" />
                  </mask>
                  <path
                    d="M20.6304 7.15898L22.0446 5.74477L21.1116 4.81175L19.8867 5.30239L20.6304 7.15898ZM17.4337 7.92124L18.848 9.33543L18.8484 9.33495L17.4337 7.92124ZM13.8341 11.521L15.2483 12.9352L15.2483 12.9352L13.8341 11.521ZM11.3907 11.5213L9.97646 12.9355L9.97692 12.936L11.3907 11.5213ZM7.77747 7.90808L6.36259 9.32163L6.36325 9.3223L7.77747 7.90808ZM4.30306 7.14798L5.00801 5.27634L3.80092 4.82169L2.88884 5.73377L4.30306 7.14798ZM1.52911 9.92194L2.94333 11.3361L2.94333 11.3361L1.52911 9.92194ZM1.52911 15.0782L2.94333 13.664L2.94333 13.664L1.52911 15.0782ZM4.30294 17.8521L2.88873 19.2663L3.80011 20.1777L5.00659 19.7242L4.30294 17.8521ZM7.77747 17.0921L6.36325 15.6779L6.36275 15.6784L7.77747 17.0921ZM11.3903 13.4792L9.97671 12.0644L9.97612 12.065L11.3903 13.4792ZM13.8341 13.4795L12.4192 14.893L12.4199 14.8937L13.8341 13.4795ZM17.4337 17.0789L18.8484 15.6652L18.8479 15.6646L17.4337 17.0789ZM20.6304 17.8412L19.8861 19.6975L21.1113 20.1887L22.0446 19.2554L20.6304 17.8412ZM23.3933 15.0782L24.8075 16.4924L24.8076 16.4924L23.3933 15.0782ZM24.8075 8.50772L22.0446 5.74477L19.2162 8.57319L21.9791 11.3362L24.8075 8.50772ZM19.8867 5.30239C20.0217 5.2483 20.2085 5.19855 20.4341 5.19855V9.19855C20.7988 9.19855 21.1174 9.11839 21.3741 9.01557L19.8867 5.30239ZM20.4341 5.19855H19.1779V9.19855H20.4341V5.19855ZM19.1779 5.19855C17.9979 5.19855 16.8532 5.67276 16.019 6.50753L18.8484 9.33495C18.9321 9.25121 19.0589 9.19855 19.1779 9.19855V5.19855ZM16.0195 6.50705L12.4199 10.1068L15.2483 12.9352L18.848 9.33543L16.0195 6.50705ZM12.4199 10.1068C12.4742 10.0525 12.5473 10.0264 12.6124 10.0264V14.0264C13.5619 14.0264 14.5203 13.6632 15.2483 12.9352L12.4199 10.1068ZM12.6124 10.0264C12.677 10.0264 12.7502 10.0524 12.8044 10.1066L9.97692 12.936C10.7047 13.6632 11.6625 14.0264 12.6124 14.0264V10.0264ZM12.8049 10.1071L9.19168 6.49387L6.36325 9.3223L9.97646 12.9355L12.8049 10.1071ZM9.19234 6.49453C8.35796 5.65936 7.21306 5.1854 6.0333 5.1854V9.1854C6.15248 9.1854 6.27912 9.23808 6.36259 9.32163L9.19234 6.49453ZM6.0333 5.1854H4.48863V9.1854H6.0333V5.1854ZM4.48863 5.1854C4.74027 5.1854 4.92594 5.24543 5.00801 5.27634L3.5981 9.01962C3.79642 9.09432 4.10521 9.1854 4.48863 9.1854V5.1854ZM2.88884 5.73377L0.114895 8.50773L2.94333 11.3361L5.71727 8.56219L2.88884 5.73377ZM0.114896 8.50773C-2.09006 10.7127 -2.09006 14.2875 0.114896 16.4924L2.94333 13.664C2.30047 13.0211 2.30047 11.979 2.94333 11.3361L0.114896 8.50773ZM0.114895 16.4924L2.88873 19.2663L5.71716 16.4378L2.94333 13.664L0.114895 16.4924ZM5.00659 19.7242C4.92575 19.7546 4.74032 19.8146 4.48863 19.8146V15.8146C4.10516 15.8146 3.7966 15.9058 3.5993 15.9799L5.00659 19.7242ZM4.48863 19.8146H6.0333V15.8146H4.48863V19.8146ZM6.0333 19.8146C7.21304 19.8146 8.35785 19.3407 9.19218 18.5058L6.36275 15.6784C6.27923 15.7619 6.1525 15.8146 6.0333 15.8146V19.8146ZM9.19168 18.5063L12.8046 14.8934L9.97612 12.065L6.36325 15.6779L9.19168 18.5063ZM12.804 14.894C12.7157 14.9822 12.6358 14.9898 12.6124 14.9898C12.5889 14.9898 12.5082 14.9821 12.4192 14.893L15.249 12.066C13.8148 10.6303 11.41 10.6323 9.97671 12.0644L12.804 14.894ZM12.4199 14.8937L16.0195 18.4931L18.8479 15.6646L15.2483 12.0652L12.4199 14.8937ZM16.019 18.4926C16.8532 19.3274 17.9979 19.8016 19.1779 19.8016V15.8016C19.0589 15.8016 18.9321 15.7489 18.8484 15.6652L16.019 18.4926ZM19.1779 19.8016H20.4341V15.8016H19.1779V19.8016ZM20.4341 19.8016C20.2088 19.8016 20.0219 19.7519 19.8861 19.6975L21.3746 15.9848C21.1172 15.8816 20.7985 15.8016 20.4341 15.8016V19.8016ZM22.0446 19.2554L24.8075 16.4924L21.9791 13.664L19.2162 16.4269L22.0446 19.2554ZM24.8076 16.4924C27.0124 14.2874 27.0124 10.7127 24.8076 8.50776L21.9791 11.3361C22.6219 11.979 22.6219 13.0212 21.9791 13.664L24.8076 16.4924Z"
                    fill="white"
                    mask="url(#path-3-inside-1_1_140)"
                  />
                </svg>
                Pix
              </button>
              <button className="credit" onClick={selectCreditCard}>
                <svg
                  width="25"
                  height="19"
                  viewBox="0 0 25 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.961182 2.64284C0.961182 1.69607 1.72869 0.928558 2.67547 0.928558H23.2469C24.1937 0.928558 24.9612 1.69607 24.9612 2.64284V16.3571C24.9612 17.3039 24.1937 18.0714 23.2469 18.0714H2.67547C1.72869 18.0714 0.961182 17.3039 0.961182 16.3571V2.64284ZM23.2469 2.64284H2.67547V16.3571H23.2469V2.64284Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.3898 13.7857C16.3898 13.3123 16.7735 12.9286 17.2469 12.9286H20.6755C21.1489 12.9286 21.5326 13.3123 21.5326 13.7857C21.5326 14.2591 21.1489 14.6428 20.6755 14.6428H17.2469C16.7735 14.6428 16.3898 14.2591 16.3898 13.7857Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.2469 13.7857C11.2469 13.3123 11.6307 12.9286 12.104 12.9286H13.8183C14.2917 12.9286 14.6755 13.3123 14.6755 13.7857C14.6755 14.2591 14.2917 14.6428 13.8183 14.6428H12.104C11.6307 14.6428 11.2469 14.2591 11.2469 13.7857Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.961182 6.16851C0.961182 5.69513 1.34494 5.31137 1.81832 5.31137H24.104C24.5774 5.31137 24.9612 5.69513 24.9612 6.16851C24.9612 6.6419 24.5774 7.02566 24.104 7.02566H1.81832C1.34494 7.02566 0.961182 6.6419 0.961182 6.16851Z"
                    fill="white"
                  />
                </svg>
                Crédito
              </button>
            </div>
            <div className="QrCodeOrCredit hide" id="qrcodeOrCredit">
              <div className="dataCredit " id="creditCard">
                <div className="numberCard">
                  <label htmlFor="number">Número do Cartão</label>
                  <input
                    type="number"
                    id="number"
                    placeholder="1234 4321 6789 9876"
                  />
                </div>
                <div className="validateAndSecurityCode">
                  <div className="validate">
                    <label htmlFor="date">Validade</label>
                    <input type="text" id="date" placeholder="04/25" />
                  </div>
                  <div className="securityCodeCard">
                    <label htmlFor="code">CVC</label>
                    <input type="text" id="code" placeholder="845" />
                  </div>
                </div>
                <button>
                  <svg
                    width="27"
                    height="22"
                    viewBox="0 0 27 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.46118 8C6.46118 7.44772 6.9089 7 7.46118 7H20.4612C21.0135 7 21.4612 7.44772 21.4612 8C21.4612 8.55229 21.0135 9 20.4612 9H7.46118C6.9089 9 6.46118 8.55229 6.46118 8Z"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.46118 12C6.46118 11.4477 6.9089 11 7.46118 11H20.4612C21.0135 11 21.4612 11.4477 21.4612 12C21.4612 12.5523 21.0135 13 20.4612 13H7.46118C6.9089 13 6.46118 12.5523 6.46118 12Z"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.54697 0.585787C1.92204 0.210714 2.43075 0 2.96118 0H24.9612C25.4916 0 26.0003 0.210714 26.3754 0.585787C26.7505 0.960861 26.9612 1.46957 26.9612 2V21C26.9612 21.3466 26.7817 21.6684 26.4869 21.8507C26.1921 22.0329 25.824 22.0494 25.514 21.8944L21.9612 20.118L18.4084 21.8944C18.1269 22.0352 17.7955 22.0352 17.514 21.8944L13.9612 20.118L10.4084 21.8944C10.1269 22.0352 9.7955 22.0352 9.51397 21.8944L5.96118 20.118L2.4084 21.8944C2.09841 22.0494 1.73027 22.0329 1.43545 21.8507C1.14063 21.6684 0.961182 21.3466 0.961182 21V2C0.961182 1.46957 1.1719 0.960859 1.54697 0.585787ZM24.9612 2L2.96118 2L2.96118 19.382L5.51397 18.1056C5.7955 17.9648 6.12687 17.9648 6.4084 18.1056L9.96118 19.882L13.514 18.1056C13.7955 17.9648 14.1269 17.9648 14.4084 18.1056L17.9612 19.882L21.514 18.1056C21.7955 17.9648 22.1269 17.9648 22.4084 18.1056L24.9612 19.382V2Z"
                      fill="white"
                    />
                  </svg>
                  Finalizar pagamento
                </button>
              </div>
            </div>
            <div className="waitingPayment " id="waitingPayment">
              <svg
                width="105"
                height="104"
                viewBox="0 0 105 104"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M52.4612 8C28.1607 8 8.46118 27.6995 8.46118 52C8.46118 76.3005 28.1607 96 52.4612 96C76.7617 96 96.4612 76.3005 96.4612 52C96.4612 27.6995 76.7617 8 52.4612 8ZM0.461182 52C0.461182 23.2812 23.7424 0 52.4612 0C81.18 0 104.461 23.2812 104.461 52C104.461 80.7188 81.18 104 52.4612 104C23.7424 104 0.461182 80.7188 0.461182 52ZM52.4612 20C54.6703 20 56.4612 21.7909 56.4612 24V48H80.4612C82.6703 48 84.4612 49.7909 84.4612 52C84.4612 54.2091 82.6703 56 80.4612 56H52.4612C50.252 56 48.4612 54.2091 48.4612 52V24C48.4612 21.7909 50.252 20 52.4612 20Z"
                  fill="white"
                />
              </svg>
              <span>Aguardando pagamento</span>
            </div>
            <div className="pix hide" id="pix">
              <img src={qrcode} alt="" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export { MyOrder };
