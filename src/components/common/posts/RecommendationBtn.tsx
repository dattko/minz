'use client';
import { toggleRecommendation } from '@/lib/action/postsAction';
import Btn from '../button/Btn';
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface RecommendationBtnProps {
  id: number;
  initialRecommendations: number;
  initiallyRecommended: boolean;
}

const RecommendationBtn: React.FC<RecommendationBtnProps> = ({ id, initialRecommendations, initiallyRecommended }) => {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [isRecommended, setIsRecommended] = useState(initiallyRecommended);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleRecommendation = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const updatedData = await toggleRecommendation(id);
      setRecommendations(updatedData.recommendations);
      setIsRecommended(!isRecommended);
    } catch (error) {
      console.error('추천 처리 중 오류 발생:', error);
      alert(error instanceof Error ? error.message : '추천 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Btn 
      size='small' 
      variant={isRecommended ? 'outline-primary' : 'primary'} 
      onClick={handleToggleRecommendation} 
      disabled={isProcessing}
    >
      <Heart size={12} fill={isRecommended ? 'currentColor' : 'none'}/> 
      {isRecommended ? '추천 취소' : '추천'} ({recommendations})
    </Btn>
  );
}

export default RecommendationBtn;