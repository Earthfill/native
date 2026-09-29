import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface Props {
  name: string;
  url: string;
}

interface Pokemon extends Props {
  image: string;
  imageBack: string;
  types: PokemonType[]
}

interface PokemonType {
  type: Props
}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  
  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types
          }
        })
      );
      
      setPokemons(detailedPokemons);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <ScrollView>
      {pokemons.map((pokemon) => (
        <View key={pokemon.name}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

          <View style={{ flexDirection: "row" }}>
            <Image 
              source={{ uri: pokemon.image }} 
              style={{ width: 100, height: 100 }} 
            />
            <Image 
              source={{ uri: pokemon.imageBack }} 
              style={{ width: 100, height: 100 }} 
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold"
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray"
  }
});
