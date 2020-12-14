import React from "react";

interface FormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  connect: () => void;
  username: string;
}

const Form: React.FC<FormProps> = ({ onChange, connect, username }) => {
  return (
    <div className="h-full flex">
      <form className="block self-center mx-auto">
        <input
          className="outline-none border focus:border-pink-400 hover:border-pink-300 rounded p-3 shadow-lg"
          placeholder="Username..."
          type="text"
          value={username}
          onChange={onChange}
        />
        <button
          className=" bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded px-4 py-3 shadow-lg ml-2"
          onClick={connect}
        >
          Connect
        </button>
      </form>
    </div>
  );
};

export default Form;
