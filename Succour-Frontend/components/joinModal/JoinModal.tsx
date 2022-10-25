import { useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import styles from './joinmodal.module.scss'
import walletIcon from '../../assets/wallet-1.svg'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import ERC20_ABI from "../../abi/ERC20.json"
import Succour_abi from "../../abi/abi.json"
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

interface IProps {
      showJoinModal: any;
      setShowJoinModal: any;
}

const JoinModal = ({ showJoinModal, setShowJoinModal } : IProps) => {
  const SuccourAddress = "0x12F57C67FDd16109B549F0B40579694fE12bf9Fd"
  const cUSDaddress = "0x07b8b15Afd654e9334A3D63396B5f9092bfb0D9E";


  const {address} = useAccount();

  const modalRef = useRef<any | any>();
  const [name, setName ] = useState("");
  const [amount, setAmount] = useState("");

  const animation = useSpring({
    config: {
      duration: 300
    },
    opacity: showJoinModal ? 1 : 0,
    transform: showJoinModal ? `translateY(0%)` : `translateY(100%)`
  })

  const closeModal = (e :any) => {
      if(modalRef.current === e.target) {
      setShowJoinModal(false)
      }
  }

  const keyPress = useCallback((e :any) => {
    if(e.key === 'Escape' && showJoinModal) {
      setShowJoinModal(false)
    }
  }, [setShowJoinModal, showJoinModal])

  useEffect(() => {
      document.addEventListener('keydown', keyPress);
      return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress])

  // User's input form
  // Approves ERC20 token to deposit
  const {
    data: approveData,
    write: approvecUSDToken,
    isLoading: approveLoading,
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: cUSDaddress,
    contractInterface: ERC20_ABI.abi,
    functionName: 'approve',
    args: [
      SuccourAddress,
      ethers.utils.parseEther(amount? amount.toString(): "0"),
    ]
  })

  const {isLoading: approveWaitLoader} = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess(){
      joinDAOWrite()
    },
    onError(data){
      console.log(data)
    }

  })

  // call joinDAO on approve
  const {
    data: joinDaoData,
    write: joinDAOWrite,
    isLoading: joinDaoLoading,
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: SuccourAddress,
    contractInterface: Succour_abi,
    functionName: 'approve',
    args:[
      name,
      ethers.utils.parseEther(amount? amount.toString(): "0")
    ]
  })

  const router = useRouter();

  const { isLoading: joinDaoWaitData } = useWaitForTransaction({
    hash: joinDaoData?.hash,
    onSuccess(){
      // add toastify; input: Transaction sent successfully
      router.push("/profilepage/ProfilePage")
    },
    onError(data){
      console.log(data)
      // add toastify; input: Error encountered in joining SuccourDAO
    }
  })



  const handleSubmit = (e:any) => {
    e.preventDefault();


    approvecUSDToken();
  }




  return (
      <>
      {showJoinModal ? (
      <div className={styles.join} ref={modalRef} onClick={closeModal}>
            {/* animating the whole container properties*/}
            <animated.div style={animation}>
                <div className={styles.wrapper}  showJoinModal={showJoinModal}>
                <div className={styles.closeButton} onClick={() => setShowJoinModal((prev : any) => !prev)}></div>
                <div className={styles.container}>
                      <div className={styles.join_content}>
                      <h1 className={styles.title}>Join Succor DAO</h1>

                      <div className={styles.join_input1}>
                        <label>Name</label>
                        <input
                        className={styles.input}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                      </div>

                    <div className={styles.text}>
                      <label>Amount to deposit</label>
                        <div className={styles.join_input}>
                          <div className={styles.wallet_icon}>
                            <Image src={walletIcon} alt="" />
                          </div>
                          <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                          />
                        <select name="choice">
                          <option value="cUSD" selected>cUSD</option>
                        </select>

                    </div>


                    </div>
                    {
                      address ?
                      <button
                      disabled={approveLoading || approveWaitLoader || joinDaoLoading || joinDaoWaitData}
                      onClick={handleSubmit}
                      >
                        {(approveLoading || approveWaitLoader || joinDaoLoading || joinDaoWaitData) ? "Loading..." : "Join DAO"}
                      </button> :
                      <ConnectButton />
                    }


                </div>

                </div>
          </div>
          </animated.div>
      </div>
        ): null}
      </>
  )
}

export default JoinModal
