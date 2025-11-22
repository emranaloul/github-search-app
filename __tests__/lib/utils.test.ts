import { cn } from '@/lib/utils';

describe('cn (className utility)', () => {
  it('should merge class names', () => {
    const result = cn('px-2', 'py-1');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base', isActive && 'active');
    expect(result).toContain('base');
    expect(result).toContain('active');
  });

  it('should remove falsy values', () => {
    const result = cn('base', false && 'hidden', undefined, null, '');
    expect(result).toBe('base');
  });

  it('should resolve tailwind conflicts with merge', () => {
    const result = cn('px-2 px-4');
    // Should keep the last value due to twMerge
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2');
  });

  it('should handle arrays', () => {
    const result = cn(['px-2', 'py-1']);
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
  });

  it('should handle objects', () => {
    const result = cn({
      'px-2': true,
      'py-1': false,
      'text-red-500': true,
    });
    expect(result).toContain('px-2');
    expect(result).toContain('text-red-500');
    expect(result).not.toContain('py-1');
  });

  it('should handle complex combinations', () => {
    const isError = true;
    const result = cn(
      'base-class',
      isError ? 'border-red-500' : 'border-green-500',
      {
        'text-white': isError,
        'bg-red-100': isError,
      }
    );
    expect(result).toContain('base-class');
    expect(result).toContain('border-red-500');
    expect(result).toContain('text-white');
    expect(result).toContain('bg-red-100');
  });
});
