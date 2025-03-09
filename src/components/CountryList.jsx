import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();

  const countries = cities.reduce((prev, cur) => {
    const country = { country: cur.country, emoji: cur.emoji, id: cur.id };

    if (
      prev.some(
        (c) => c.country === country.country && c.emoji === country.emoji
      )
    )
      return prev;
    else return [...prev, country];
  }, []);

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message
        message={"Start adding your Countries by clicking on the map."}
      />
    );
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
