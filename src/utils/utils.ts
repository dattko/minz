type DateFormatOptions = {
  showTime?: boolean;
  showDate?: boolean;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
};

export function formatDate(dateString: string, options: DateFormatOptions = {}): string {
  try {
    const {
      showTime = true,
      showDate = true,
      dateStyle = 'medium',
      timeStyle = 'medium'
    } = options;

    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // UTC 날짜/시간 값을 직접 사용
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours() + 9).padStart(2, '0'); // KST = UTC+9
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    let formattedDate = '';

    if (showDate) {
      switch(dateStyle) {
        case 'full':
        case 'long':
          formattedDate += `${year}년 ${month}월 ${day}일`;
          break;
        case 'medium':
          formattedDate += `${year}. ${month}. ${day}.`;
          break;
        case 'short':
          formattedDate += `${year}.${month}.${day}`;
          break;
      }
    }

    if (showTime) {
      if (showDate) formattedDate += ' ';
      switch(timeStyle) {
        case 'full':
        case 'long':
          formattedDate += `${hours}시 ${minutes}분 ${seconds}초`;
          break;
        case 'medium':
          formattedDate += `${hours}:${minutes}:${seconds}`;
          break;
        case 'short':
          formattedDate += `${hours}:${minutes}`;
          break;
      }
    }

    return formattedDate;
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString || '';
  }
}


// 모든 이벤트 타입을 포함하는 유니온 타입
type EventType = 
  | React.MouseEvent
  | React.KeyboardEvent
  | React.TouchEvent
  | React.FocusEvent
  | Event;

// 이벤트의 기본 동작을 막는 함수
export function preventDefault<T extends EventType>(event: T): void {
  if (event.preventDefault) {
    event.preventDefault();
  }
}

// 이벤트의 전파를 막는 함수
export function stopPropagation<T extends EventType>(event: T): void {
  if (event.stopPropagation) {
    event.stopPropagation();
  }
}

// 이벤트의 기본 동작과 전파를 모두 막는 함수
export function preventDefaultAndStopPropagation<T extends EventType>(event: T): void {
  preventDefault(event);
  stopPropagation(event);
}

// 특정 키 입력을 처리하는 함수 (예: Enter 키)
export function handleEnterKey(event: React.KeyboardEvent, callback: () => void): void {
  if (event.key === 'Enter') {
    preventDefault(event);
    callback();
  }
}

// 디바운스 함수
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 쓰로틀 함수
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}