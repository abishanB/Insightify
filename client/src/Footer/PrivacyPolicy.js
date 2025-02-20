import React from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PrivacyPolicy(){

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="policy-container">
      <h4>Privacy Policy</h4>
      <h6>Heading 1.</h6>
      <p>   
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dapibus semper sapien vitae varius. Sed condimentum malesuada leo et elementum. Duis id ipsum odio.
      </p>
      <p>
      Quisque porttitor dignissim elementum. Curabitur sit amet dolor vel lectus gravida fringilla. Phasellus euismod blandit sapien, sed pharetra leo. Nunc efficitur eu sem et porttitor. Aliquam erat volutpat. Pellentesque ac fermentum mi. Sed ultricies nibh libero, in sollicitudin massa porta ac. Proin augue orci, volutpat convallis ultrices sed, porta vel felis.
      </p>

      <h6>Heading 2.</h6>
      <p> Quisque porttitor dignissim elementum. Curabitur sit amet dolor vel lectus gravida fringilla. Phasellus euismod blandit sapien, sed pharetra leo. Nunc efficitur eu sem et porttitor. Aliquam erat volutpat. Pellentesque ac fermentum mi. Sed ultricies nibh libero, in sollicitudin massa porta ac. Proin augue orci, volutpat convallis ultrices sed, porta vel felis.</p>
    </div>
  )
}