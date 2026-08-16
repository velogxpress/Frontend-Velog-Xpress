import InjectableSvg from "@/components/common/InjectableSvg"
import { useEffect, useState } from "react";
import { listCities} from "@/services/VilleService";
import { getPrice} from "@/services/CalculatriceService";
import { get } from "http";

interface Ville {
  id: number;
  description: string;
  abreger: string;
  region?: Region;
}

interface Region {
  id: number;
  description: string;
}




const FaqForm = () => {

     const[villes,setVilles]=useState<Ville[]>([]);
     const [selectedVille, setSelectedVille] = useState<string>('');
     const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);
     const [selectedCategory, setSelectedCategory] = useState<string>('');
     const [show,setShow]=useState<boolean>(false);
     const [msg,setMsg]=useState<string>("");
     const [price, setPrice] = useState<number>(0);
     const [poids, setPoids] = useState<number>(0);

const fetchVilles = async () => {
     try {
       const response = await listCities(0);
       
       setVilles(response.data.content);
     } catch (error) {
       console.error("Erreur lors de la récupération des villes:", error);
     }
   };
   
   useEffect(() => {
     fetchVilles();
   }, []);

const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedCategory(e.target.value);
  if (e.target.value === "Electronique") {
    setShow(true);
    setMsg("Pour tout colis électronique, les frais appliqués sont fixes et calculés en fonction de l’objet envoyé. Veuillez contacter le service client pour plus d’informations.");
  } else if (e.target.value === "Document") {
    setShow(true);
    setMsg("Pour tout les documents, les frais appliqués sont fixes et calculés en fonction du document envoyé. Veuillez contacter le service client pour plus d’informations.");
  } else if (e.target.value === "Normal") {
    setShow(false);
    setMsg("");
  } 
}

  function handleCalculator(selectedVilleId: number | null, poids: number): void {
    // Determine ville id (fall back to selectedVille string if needed)
    const villeId = selectedVilleId ?? (selectedVille ? Number(selectedVille) : null);

    if (!villeId || isNaN(villeId)) {
      alert("Veuillez sélectionner une destination.");
      return;
    }
    if (!poids || poids <= 0) {
      alert("Veuillez entrer un poids valide.");
      return;
    }
    if (selectedCategory !== "Electronique" && selectedCategory !== "Document" && selectedCategory !== "Normal") {
      alert("Veuillez sélectionner une catégorie valide.");
      return;
    }

   getPrice(villeId, poids)
      .then((response) => {
        const computedPrice = response.data;
        setPrice(computedPrice);
      })
      .catch((error) => {
        alert("Il n'ya pas encore de prix defini pour cette destination.");
      });
    
    
  }
  
   return (
     <form onSubmit={(e) => e.preventDefault()} className="request__form-three">
       <div className="form-grp select-grp">
          <select
            name="select__service"
            className="orderby"
            value={selectedVilleId !== null ? String(selectedVilleId) : ''}
            onChange={(e) => setSelectedVilleId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Sélectionnez une Destination</option>

            {villes.map((ville) => (
              <option key={ville.id} value={String(ville.id)}>
                {ville.abreger} - {ville.description}
              </option>
            ))}
          </select>
       </div>
       <div className="form-grp select-grp">
         <select name="service__type" className="orderby" 
          value={selectedCategory}
          onChange={(e) => handleSelectCategory(e)}
         >
           <option value="Selectionnez une Catégorie">Selectionnez une Catégorie</option>
             <option value="Electronique">Electronique</option>
             <option value="Document">Document</option>
             <option value="Normal">Autres</option>
         </select>
       </div>
       {show ? (<div className="alert alert-danger" role="alert">
         {msg}
       </div>
       ):(
        <>
       <div className="form-grp">
         <input type="text" placeholder="Poids du colis" value={poids} onChange={(e) => setPoids(Number(e.target.value))} />
       </div>
       <div className="form-grp">
         <fieldset>
           <legend>Prix estimé</legend>
           <h4>{price}</h4>
         </fieldset>
       </div>
       <button className="btn" 
        onClick={() => handleCalculator(selectedVilleId, poids)}
       >
         Soumettre une demande{" "}
         <InjectableSvg
           src="/assets/img/icon/right_arrow.svg"
           alt=""
           className="injectable"
         />
       </button>
       </>
      )}
     </form>
   );
}

export default FaqForm
