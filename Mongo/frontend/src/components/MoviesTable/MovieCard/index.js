import React, { useState, useEffect } from "react";
import Axios from "axios";
import FlippingCardFront from "./CardFront";
import "./style.css";


export default function ({ movie, LogedIn }) {
  const {
    id,
    naziv,
    opis,
    trejlerUrl,
    vremeTrajanja,
  } = movie;
  const logedIn = LogedIn;
  console.log(id);
  const [coverImage, setCoverImage] = useState("");
  const [reditelj, setReditelj] = useState("");
  const [zanr, setZanr] = useState("");
  const [glumci, setGlumci] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(id);
        const [slika,  rediteljData, zanrData, glumciData] = await Promise.all([
          Axios.get(`http://localhost:5054/api/slike/vrati-sliku/${id}`),
          Axios.get(`http://localhost:5054/api/reditelji/vrati-reditelja/${id}`),
          Axios.get(`http://localhost:5054/api/zanrovi/vrati-zanr/${id}`),
          Axios.get(`http://localhost:5054/api/glumci/vrati-glumce-za-film/${id}`),
        ]);

        setCoverImage(slika.data.url);
        console.log(slika);
        console.log(rediteljData);
        setReditelj(`${rediteljData.data.ime} ${rediteljData.data.prezime}`);
        setZanr(zanrData.data.tip);
        setGlumci(glumciData.data);
      } catch (error) {
        console.error('Error:', error);
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    };

    fetchData();
  }, [id]);

  

  return (
    <div className={`card-container ${isFlipped ? "flipped" : ""}`}>
      <div className="card-wrapper" >
        <FlippingCardFront
          id={id}
          trejlerUrl={trejlerUrl}
          reditelj={reditelj}
          glumci={glumci}
          coverImage={coverImage}
          vremeTrajanja={vremeTrajanja}
          zanr={zanr}
          naziv={naziv}
          logedIn={logedIn}
          opis={opis}
        />

        
      </div>
    </div>
  );
}
