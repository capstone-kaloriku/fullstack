'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaBowlFood, FaClock, FaSun } from 'react-icons/fa6';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

import { logFoodConsumption } from '../../../actions';

// ============================================================
// Types
// ============================================================

interface FoodData {
  id: string;
  nama: string;
  kalori: number;
}

interface FoodLogFormProps {
  food: FoodData;
}

// ============================================================
// Constants — meal type options
// ============================================================

const MEAL_TYPES = [
  { id: 1, label: 'Pagi', value: 'Pagi' },
  { id: 2, label: 'Siang', value: 'Siang' },
  { id: 3, label: 'Malam', value: 'Malam' },
  { id: 4, label: 'Camilan', value: 'Camilan' },
];

// ============================================================
// Component — Form for logging food consumption
// ============================================================

function FoodLogForm({ food }: FoodLogFormProps) {
  // Form state
  const [portion, setPortion] = useState<number>(1);
  const [mealType, setMealType] = useState<string>('');
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    // Avoid synchronous state updates during initial render/effect phase
    const timer = setTimeout(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Submission state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Calculated total calories based on portion
  const totalCalories = Math.round(food.kalori * portion);

  // Handle form submission
  async function handleSubmit() {
    // Validation
    if (!mealType) {
      setError('Pilih jenis makanan terlebih dahulu.');
      return;
    }
    if (portion <= 0) {
      setError('Porsi harus lebih dari 0.');
      return;
    }

    setError(null);
    setIsLoading(true);

    // Refresh displayed submit time to reflect the actual click moment.
    // Note: this is display-only — the database records `logged_at` via `now()`.
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${minutes}`);

    // Call server action directly (not inside startTransition)
    const result = await logFoodConsumption({
      foodId: food.id,
      portion,
      mealType,
      totalCalories,
    });

    if (!result.success) {
      setError(result.error || 'Gagal menyimpan data konsumsi.');
      setIsLoading(false);
      return;
    }

    // Success — redirect to dashboard
    router.push('/dashboard');
  }

  return (
    <FieldGroup>
      {/* Error banner */}
      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Jam Submit */}
      <div className="w-full">
        <Card className="w-full py-6">
          <CardHeader className="flex items-center gap-5">
            <FaClock size={18} className="text-primary" />
            <CardTitle className="text-lg font-bold">Jam Submit</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-start gap-5">
            <div className="flex items-center justify-center gap-2 w-full">
              <InputGroup className="px-4 py-6 flex items-center rounded-lg border border-primary text-primary w-full">
                <InputGroupInput
                  type="time"
                  className="placeholder:text-primary/50 w-full"
                  placeholder="Waktu submit otomatis"
                  value={time}
                  readOnly
                />
              </InputGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Porsi */}
      <div className="w-full">
        <Card className="w-full py-6">
          <CardHeader className="flex flex-row items-center gap-5">
            <FaBowlFood size={18} className="text-primary" />
            <CardTitle className="text-lg font-bold">Porsi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-start gap-5">
            <InputGroup>
              <InputGroupInput
                min={0}
                type="number"
                className="placeholder:text-primary/50 text-primary w-full"
                placeholder="Berapa porsi? ..."
                value={portion}
                onChange={(e) => setPortion(Number(e.target.value) || 0)}
              />
            </InputGroup>
            {/* Live calorie preview */}
            <span className="text-sm text-muted-foreground">
              Total: <strong className="text-primary">{totalCalories} kcal</strong> ({portion} porsi × {food.kalori} kcal)
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Jenis Makanan (meal type) */}
      <div className="w-full">
        <Card>
          <CardHeader className="flex flex-row items-center gap-5">
            <FaSun size={18} className="text-primary" />
            <CardTitle className="text-lg font-bold">Jenis Makanan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-start gap-5">
            <ToggleGroup
              value={mealType ? [mealType] : []}
              onValueChange={(values) => setMealType(values[0] ?? '')}
              className="grid grid-cols-2 gap-2 rounded-2xl items-center justify-center mx-auto w-full"
              spacing={2}
            >
              {MEAL_TYPES.map((item) => (
                <ToggleGroupItem
                  key={item.id}
                  value={item.value}
                  className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary"
                  variant="outline"
                >
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardContent>
        </Card>
      </div>

      {/* Submit button */}
      <Button
        className="w-full py-6"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin mr-2" />
            Menyimpan...
          </>
        ) : (
          'Simpan'
        )}
      </Button>
    </FieldGroup>
  );
}

export default FoodLogForm;
