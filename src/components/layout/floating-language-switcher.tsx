
'use client';

import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Languages } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { languages } from '@/lib/data';

export function FloatingLanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLButtonElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPosition({ x: 20, y: window.innerHeight - 80 });
  }, []);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    if (dragRef.current) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      // Prevents text selection while dragging
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isMounted) {
    return null; // Don't render anything on the server or during the initial client render
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={dragRef}
          variant="secondary"
          size="icon"
          className={cn(
            'fixed z-50 h-14 w-14 rounded-full shadow-lg cursor-grab',
            isDragging && 'cursor-grabbing'
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onMouseDown={handleMouseDown}
        >
          <Languages className="h-6 w-6" />
          <span className="sr-only">{t('Change language')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{t('Language')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('Select a language for the UI.')}
            </p>
          </div>
          <RadioGroup value={language} onValueChange={(lang) => setLanguage(lang)} className="grid gap-2">
            {languages.map(lang => (
              <div key={lang.code} className="flex items-center space-x-2">
                <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                <Label htmlFor={`lang-${lang.code}`}>{lang.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}
