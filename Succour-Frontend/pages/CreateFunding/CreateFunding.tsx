// import {useRef} from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './createfunding.module.scss'
import Navbar from '../../layouts/navbar/Navbar'
import Footer from '../../layouts/footer/Footer'
import documentCloudSvg from '../../assets/document-cloud-2.svg'
import arrowLeftSvg from '../../assets/arrow-left.svg'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import Succour_abi from "../../abi/abi.json"
import { ethers } from 'ethers'
import { ConnectButton } from '@rainbow-me/rainbowkit'


const CreateFunding = () => {
     const SuccourAddress = "0x12F57C67FDd16109B549F0B40579694fE12bf9Fd"

     const [fundname, setFundname] = useState("");
     const [fundreason, setFundreason] = useState("");
     const [amountneeded, setAmountneeded] = useState("")


     const { address } = useAccount();


     const {
          data: createFundData,
          write: createFundWrite,
          isLoading: fundingIsLoading,
     } = useContractWrite({
          mode: 'recklesslyUnprepared',
          addressOrName: SuccourAddress,
          contractInterface: Succour_abi,
          functionName: 'createGofund',
          args: [
               fundname,
               fundreason,
               ethers.utils.parseEther(amountneeded ? amountneeded.toString(): "0")
          ]
     })

     const {
          isLoading: fundingLoader
     } = useWaitForTransaction({
          hash: createFundData?.hash,
          onSuccess(){
               // add toastify; input: Successfully create fund
          },
          onError(data){
               console.log(data)
               // add toastify; input: Error encountered while creating Fund
          }
     })

     const handleSubmit = (e:any) => {
          e.preventDefault();

          createFundWrite();
     }
     return (
          <>
          <Navbar />
           <div className={styles.createfund}>
             <div className={styles.left_arrow}>
                <div className={styles.back_arrow}>
               <Link href="/Crowdfunding/Crowdfunding">
                <div className={styles.arrow}>
                    <Image src={arrowLeftSvg} alt="" />
                </div>
               </Link>
              </div>
              </div>
            
             <div className={styles.wrapper}>
              <div className={styles.top_container}>
               <div className={styles.createfund_container}>
                    <div className={styles.createfund_content}>
                   <form className={styles.createfund_form}>
                     <div className={styles.title}>Create funding request</div>
                     {/* <label>Member ID</label>
                     <input id="input" name="input" type="text" /> */}

                      <label>Project title</label>
                     <input id="input" name="input" type="text" value={fundname} onChange={(e)=> e.target.value} />

                     <label>Project links</label>
                     <input id="input" name="input" type="text" onChange={(e)=> e.target.value}/>

                      <label>Amount proposed</label>
                      <input id="input" name="input" type="text" value={amountneeded} onChange={(e)=> e.target.value}/>

                      <label>Project description</label>
                     <textarea cols={30} rows={5} value={fundreason} onChange={(e)=> e.target.value}></textarea>
                     {/* <label>Project media</label>
                     <div className={styles.upload_btn_wrapper}>
                         <div className={styles.cloudsvg}>
                              <div className={styles.icon}>
                               <Image src={documentCloudSvg} alt="" />
                              </div>
                                <input type="file" 
                         name="selectfile" 
                         id="selectfile" 
                         className={styles.upload}
                         />
                              <p>Click here to upload an image</p>
                         </div>
                     </div> */}
                     {
                         address ?
                         <button
                         className={styles.form_btn}
                         disabled={fundingIsLoading || fundingLoader}
                         onClick={handleSubmit}
                         >
                              {(fundingIsLoading || fundingLoader) ? "Loading..." : "Create Funding"}
                         </button> :
                         <ConnectButton />
                     }

                   </form>
               </div>
               </div>
            
              </div>
             </div>  
          </div>
          <Footer />
          </>
     )
}

export default CreateFunding
