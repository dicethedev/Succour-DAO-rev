import {useState} from 'react'
import Navbar from '../../components/navbar/Navbar'
import styles from './profilepage.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import arrowLeftSvg from '../../assets/arrow-left.svg'
import WithDrawAlert from '../../components/withdrawalert/WithdrawAlert'
import DepositModal from '../../components/depositModal/DepositModal'
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
          },
          onError(data){
               console.log(data)
               // add toastify; input: Unable to request for withdrawal
          }
     })

     const handleSubmit = (e:any) => {
          e.preventDefault();

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
                              <button className={styles.withdraw} onMouseMove={openModal}>Withdraw</button>
                         <button
                         className={styles.request}
                         disabled={requestLoading || rtwLoader}
                         onClick={handleSubmit}
                         >
                              {(requestLoading || rtwLoader) ? "Loading..." : "Request to Withdraw"}
                         </button>
                         </>:
                         <ConnectButton />
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
