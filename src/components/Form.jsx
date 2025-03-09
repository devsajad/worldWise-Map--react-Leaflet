import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import Button from "./Button";
import styles from "./Form.module.css";
import BackButton from "./BackButton";
import useUrlPosition from "./hooks/useUrlPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

const API_KEY_REV_GEO = "bdc_23f36c1b69d04245ad49f62c82baebdc";
const API_BASE_URL = "https://api-bdc.net/data/reverse-geocode";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const [loadingGeoCoding, setLoadingGeoCoding] = useState(false);

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getLocation() {
      try {
        if (!lat || !lng) throw new Error("Start by clicking on the map 🗺️📌");
        setError("");
        setLoadingGeoCoding(true);

        const res = await fetch(
          `${API_BASE_URL}?latitude=${lat}&longitude=${lng}&localityLanguage=en&key=${API_KEY_REV_GEO}`
        );
        const data = await res.json();

        if (!data.countryName)
          throw new Error(
            "You clicked invalid place . Please click somewhere else 🙂‍↔️🤏"
          );

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setLoadingGeoCoding(false);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingGeoCoding(false);
      }
    }
    getLocation();
  }, [lat, lng]);

  async function handlSubmitForm(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    console.log(country);
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (loadingGeoCoding) return <Spinner />;
  if (error) return <Message message={error} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handlSubmitForm}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          placeholder={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          dateFormat={"yyyy/MM/dd"}
          onChange={(date) => setDate(date)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
