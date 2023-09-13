import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import PokemonColection from './components/PokemonColection';
import { Pokemon } from './interface';

interface Pokemons {
  name: string,
  url: string,
}

const App:React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>("");
  useEffect(() => {
    const getPokemon = async() => {
      const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0");
      setNextUrl(res.data.next);
      res.data.results.forEach(async(pokemon:Pokemons) => {
        const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        setPokemons((p) => [...p, poke.data]);
      })
    }
    getPokemon();
  }, []);

  const loadmore = async () => {
    let res = await axios.get(nextUrl);
    setNextUrl(res.data.next);
    res.data.results.forEach(async (pokemon: Pokemons) => {
      const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      setPokemons((p) => [...p, poke.data])
    })
  }

  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header">Pokemon</header>
        <PokemonColection pokemons = {pokemons}/>
        <div className="btn" onClick={loadmore}>
          <button>
            Load more
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
