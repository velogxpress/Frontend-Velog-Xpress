/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
"use client";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import AOS from "aos";

if (typeof window !== "undefined") {
    require("bootstrap/dist/js/bootstrap");
}

const Wrapper = ({ children }: any) => {

    useEffect(() => {
        AOS.init();
    }, [])

    return <>
        {children}
        <ToastContainer position="top-center" />
    </>;
}

export default Wrapper
