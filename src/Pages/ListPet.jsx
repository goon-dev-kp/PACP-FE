import React from 'react';
import NavBar from '../Components/HomePage/NavBar';
import FilterCreateButtonListPet from '../Layout/FilterCreateButtonListPet';
import PetListContainer from '../Layout/PetListContainer';
import '../Style/ListPet/ListPet.css';

export default function ListPet() {
  return (
    <div className="listpet-bg">
      <NavBar />
      <section className="listpet-section">
        <FilterCreateButtonListPet />
        <PetListContainer />
      </section>
    </div>
  );
}
