import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "", 
    email: "",
    motdepasse: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Registration failed");
        console.log(error.response?.data?.message);
      } else {
        alert("An error occurred during registration");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="First Name"
            value={formData.prenom}
            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
            required
          />
          <Input
            label="Last Name" 
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input
            label="Password"
            type="password"
            value={formData.motdepasse}
            onChange={(e) => setFormData({...formData, motdepasse: e.target.value})}
            required
          />
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Card>
    </div>
  );
}
