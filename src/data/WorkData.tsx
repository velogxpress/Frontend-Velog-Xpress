interface DataType {
   id: number;
   icon: string;
   number: string;
   title: string;
   desc: JSX.Element;
   shape: string;
}

const work_data: DataType[] = [
   {
      id: 1,
      number: "01",
      icon: "flaticon-package",
      title: "Request A Quote",
      desc: (<>There are many variation sear passages orem</>),
      shape: "/assets/img/images/work_shape01.svg",
   },
   {
      id: 2,
      number: "02",
      icon: "flaticon-support",
      title: "Call Back From Office",
      desc: (<>There are many variation sear passages orem</>),
      shape: "/assets/img/images/work_shape02.svg",
   },
   {
      id: 3,
      number: "03",
      icon: "flaticon-global-distribution",
      title: "Delivery Available",
      desc: (<>There are many variation sear passages orem</>),
      shape: "/assets/img/images/work_shape01.svg",
   },
   {
      id: 4,
      number: "04",
      icon: "flaticon-parcel",
      title: "Deliver Shipping",
      desc: (<>There are many variation sear passages orem</>),
      shape: "/assets/img/images/work_shape01.svg",
   },
];

export default work_data;