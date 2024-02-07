"use client"
import React, { useState, useEffect } from 'react';
import { Greet } from '@/wailsjs/go/main/App';

export default function Home() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    async function fetchGreeting() {
      try {
        // Llama a la función Greet de Go y espera por la respuesta
        const response = await Greet("Test");
        setGreeting(response);
      } catch (error) {
        console.error('Error fetching greeting:', error);
      }
    }

    fetchGreeting();
  }, []);

  return (
    <div>
      {greeting ? <p>{greeting}</p> : <p>Loading greeting...</p>}
    </div>
  );
}