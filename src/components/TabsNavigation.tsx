
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';

const TabsNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="mt-2">
      <Tabs defaultValue={location.pathname === "/" ? "dictionnaire" : "categories"} className="w-full" onValueChange={(value) => {
        if (value === "dictionnaire") navigate("/");
        if (value === "categories") navigate("/categories");
        if (value === "verbes") navigate("/verbes");
      }}>
        <TabsList className="grid w-full grid-cols-3 bg-transparent">
          <TabsTrigger 
            value="dictionnaire" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 data-[state=active]:rounded-none data-[state=active]:bg-transparent py-2"
          >
            DICTIONNAIRE
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 data-[state=active]:rounded-none data-[state=active]:bg-transparent py-2"
          >
            CATÉGORIES
          </TabsTrigger>
          <TabsTrigger 
            value="verbes" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 data-[state=active]:rounded-none data-[state=active]:bg-transparent py-2"
          >
            VERBES
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabsNavigation;
