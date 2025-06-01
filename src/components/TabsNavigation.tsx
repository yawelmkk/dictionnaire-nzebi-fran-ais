
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';

const TabsNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="mt-2">
      <Tabs defaultValue="dictionnaire" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-transparent">
          <TabsTrigger 
            value="dictionnaire" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 data-[state=active]:rounded-none data-[state=active]:bg-transparent py-2"
          >
            DICTIONNAIRE
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabsNavigation;
