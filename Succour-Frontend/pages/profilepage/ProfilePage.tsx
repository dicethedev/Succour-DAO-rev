import {useState} from 'react'
import Navbar from '../../components/navbar/Navbar'
import styles from './profilepage.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import arrowLeftSvg from '../../assets/arrow-left.svg'
import WithDrawAlert from '../../components/withdrawalert/WithdrawAlert'
import DepositModal from '../../components/depositModal/DepositModal'
import { ToastContainer, toast } from 'react-toastify'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import Succour_abi from "../../abi/abi.json"
import { ConnectButton } from '@rainbow-me/rainbowkit'

const ProfilePage = () => {

  const SuccourAddress = "0x12F57C67FDd16109B549F0B40579694fE12bf9Fd"
  const { address } = useAccount();


     const [showModal, setShowModal] = useState(false);
     const [showDepositModal, setShowDepositModal] = useState(false);

     const openModal = () => {
          setShowModal(prev => !prev);
     }

     const openDepositModal = () => {
        setShowDepositModal(prev => !prev);
     }


     const {
          data: requestToWithdrawData,
          write: requestToWithdrawWrite,
          isLoading: requestLoading
     } = useContractWrite({
          mode: 'recklesslyUnprepared',
          addressOrName: SuccourAddress,
          contractInterface: Succour_abi,
          functionName: 'requestToWithdrawDAO'
     })

     const {isLoading: rtwLoader} = useWaitForTransaction({
          hash: requestToWithdrawData?.hash,
          onSuccess(){
               // add toastify; input: You've Requested for withdrawal
                toast.success('You have Requested for withdrawal', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 8000
                })
          },
          onError(data){
               console.log(data)
               // add toastify; input: Unable to request for withdrawal
                 toast.error('Unable to request for withdrawal', 
               { position: toast.POSITION.TOP_CENTER })
          }
     })

     const handleSubmit = (e:any) => {
          e.preventDefault();

          openModal();
          requestToWithdrawWrite();
     }

  return (
     <>
      <Navbar />
      {/* Deposit Modal is here */}
      <DepositModal showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal} />
       {/* Width Alert Info Modal */}
      <WithDrawAlert showModal={showModal} setShowModal={setShowModal} />
      <div className={styles.profile}>
       <div className={styles.wrapper}>
         <div className={styles.left}>
          <div className={styles.back_arrow}>
              <Link href="/Projects/Projects">
              <div className={styles.arrow}>
                  <Image src={arrowLeftSvg} alt="" />
                </div>
               </Link>
               </div>
        </div>
        <div className={styles.container}>
          <div className={styles.top_container}>
           <div className={styles.profile_content}>
               <div className={styles.profile_info}>
                    <div className={styles.name_address}>
                      <h1 className={styles.title}>John Doe</h1>
                      <p className={styles.id}>Member ID: <span>001231</span></p>
                    </div>
                    
                    <div className={styles.address_info}>
                         <h2 className={styles.member_address}>Member Address</h2>
                       <p className={styles.address}>dnjhndiuropwo096069</p>
                    </div>
               </div>

               <div className={styles.profile_vote}>
                    <div className={styles.vote_count}>
                      <h2 className={styles.vote_power}>Voting Power: <span>0.785</span></h2>
                     <h2 className={styles.vote_percentage}>Percentage of DAO: <span>0.15</span></h2>
                    </div>

                    <div className={styles.balance_count}>
                         <h1 className={styles.balance_title}>Balance</h1>
                         <h2 className={styles.balance}>4000 USDC</h2>
                         <button className={styles.deposit_btn} onClick={openDepositModal}>Deposit funds</button>
                    </div>
               </div>

                  <div className={styles.profile_btn}>
                    {
                         address ?
                         <>
                              <button className={styles.withdraw}>Withdraw</button>
                         <button
                         // onMouseMove={openModal}
                         className={styles.request}
                         disabled={requestLoading || rtwLoader}
                         onClick={handleSubmit}
                         >
                              {(requestLoading || rtwLoader) ? "Loading..." : "Request to Withdraw"}
                         </button>
                         </>:
                         <div>
              <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className={styles.connect_btn}>
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className={styles.wrong_btn}>
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
              </ConnectButton.Custom>
                         </div>
                    }
                         
                    </div>
           </div>
          </div>
        </div>
       </div>
      </div>
     </>
  
  )
}

export default ProfilePage
