'use client';
import { toggleRecommendation } from '@/lib/action/postsAction';
import Btn from '../button/Btn';
import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';

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
      const result = await toggleRecommendation(id);
      setRecommendations(result.recommendations);
      setIsRecommended(result.isRecommended);
    } catch {
      console.error('추천 처리 중 오류 발생');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Btn 
      size='small' 
      variant={isRecommended ? 'primary' : 'outline-primary'} 
      onClick={handleToggleRecommendation} 
      disabled={isProcessing}
    >
      <ThumbsUp size={11}/> 
      {isRecommended ? '취소' : '추천'} ({recommendations})
    </Btn>
  );
}

export default RecommendationBtn;
