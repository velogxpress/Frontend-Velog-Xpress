"use client"
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import InjectableSvg from "../common/InjectableSvg"

interface FormData {
   name: string;
   email: string;
   message: string;
   web: string;
}

const schema = yup
   .object({
      name: yup.string().required().label("Name"),
      email: yup.string().required().email().label("Email"),
      message: yup.string().required().label("Message"),
      web: yup.string().required().label("Website"),
   })
   .required();

const TeamForm = () => {

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });
   const onSubmit = () => {
      const notify = () => toast('Comment sent successfully', { position: 'top-center' });
      notify();
      reset();
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="team__details-form">
         <div className="row gutter-20">
            <div className="col-md-6">
               <div className="form-grp">
                  <input type="text" {...register("name")} placeholder="Name" />
                  <p className="form_error">{errors.name?.message}</p>
               </div>
            </div>
            <div className="col-md-6">
               <div className="form-grp">
                  <input {...register("email")} type="email" placeholder="Email" />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
            </div>
            <div className="col-md-6">
               <div className="form-grp">
                  <input type="url" {...register("web")} placeholder="Website" />
                  <p className="form_error">{errors.web?.message}</p>
               </div>
            </div>
            <div className="col-md-6">
               <div className="form-grp">
                  <input type="text" placeholder="Subject" />
               </div>
            </div>
         </div>
         <div className="form-grp">
            <textarea placeholder="Comment" {...register("message")}></textarea>
            <p className="form_error">{errors.message?.message}</p>
         </div>
         <button type="submit" className="btn red-btn">Send Me Message <InjectableSvg src="/assets/img/icon/right_arrow.svg" alt="" className="injectable" /></button>
      </form>
   )
}

export default TeamForm
