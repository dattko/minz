type DateFormatOptions = {
  showTime?: boolean;
  showDate?: boolean;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
};

export function formatDate(dateString: string, options: DateFormatOptions = {}): string {
  const {
    showTime = true,
    showDate = true,
    dateStyle = 'medium',
    timeStyle = 'medium'
  } = options;

  const date = new Date(dateString);
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    hour12: false // 24시간 형식 강제
  };

  if (showDate) {
    formatOptions.dateStyle = dateStyle;
  }

  if (showTime) {
    formatOptions.timeStyle = timeStyle;
  }

  // // 날짜만 표시하거나 시간만 표시할 경우
  // if (!showDate || !showTime) {
  //   delete formatOptions.dateStyle;
  //   delete formatOptions.timeStyle;

  //   if (showDate) {
  //     formatOptions.year = 'numeric';
  //     formatOptions.month = 'long';
  //     formatOptions.day = 'numeric';
  //   }

  //   if (showTime) {
  //     formatOptions.hour = '2-digit';
  //     formatOptions.minute = '2-digit';
  //   }
  // }

  let formattedDate = date.toLocaleString('ko-KR', formatOptions);
  // 마지막에 오는 점을 제거
  formattedDate = formattedDate.replace(/\.$/, '');

  return formattedDate;

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