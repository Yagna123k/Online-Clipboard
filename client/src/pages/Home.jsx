import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate()

  const inputHandler = (e) => {
    setCode(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      alert("Please enter a valid clipboard code.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/clipboard/go`, { code });

      if (response.status === 200 || response.status === 201) {
        navigate(`/clipboard/${code}`)
        console.log("Clipboard Items:", response.data.items);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-[100vw] h-[100vh] gap-4'>
      <h1 className='text-3xl font-bold'>Enter Into Clipboard</h1>
      <form action="submit" onSubmit={submitHandler} className='flex gap-2 items-center'>
        <input type="text" placeholder='Enter your clipboard code' className='border-2 p-2 w-md rounded-sm' onChange={inputHandler} />
        <button className='p-2 bg-blue-500 text-white rounded-sm' type='submit'><Send /></button>
      </form>
    </div>
  );
};

export default Home;
