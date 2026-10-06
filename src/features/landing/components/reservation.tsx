'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { requestReservation } from '@/features/landing/api';
import { useDiagnosisResults } from '@/features/landing/hooks/use-diagnosis-results';
import { fieldClassName, neonButtonClassName, neonCardClassName } from '@/features/landing/constants/ui';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';
import {
  formatConsultationTime,
  GRADE_OPTIONS,
  reservationSchema,
  type ReservationFormValues,
} from '@/features/landing/lib/reservation';
import { cn } from '@/lib/utils';

const emptyValues: ReservationFormValues = {
  studentName: '',
  grade: undefined as unknown as ReservationFormValues['grade'],
  parentPhone: '',
  preferredDateTime: '',
  levelTestResult: '',
  styleTestResult: '',
};

const diagnosisFieldClassName = cn(fieldClassName, 'h-auto min-h-28 resize-none py-3 leading-relaxed read-only:opacity-100');

export function Reservation() {
  const [receipt, setReceipt] = useState<ReservationFormValues | null>(null);
  const [submitError, setSubmitError] = useState('');
  const levelTestResult = useDiagnosisResults((state) => state.levelTestResult);
  const styleTestResult = useDiagnosisResults((state) => state.styleTestResult);
  const clearDiagnosisResults = useDiagnosisResults((state) => state.clearDiagnosisResults);
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: emptyValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });
  const { setValue } = form;

  useEffect(() => {
    setValue('levelTestResult', levelTestResult);
    setValue('styleTestResult', styleTestResult);
  }, [levelTestResult, styleTestResult, setValue]);

  const onSubmit = async (values: ReservationFormValues) => {
    setSubmitError('');
    const submitted = {
      ...values,
      levelTestResult,
      styleTestResult,
    };

    const result = await requestReservation(submitted);

    if (result.ok === false) {
      setSubmitError(result.message);
      return;
    }

    setReceipt(submitted);
    clearDiagnosisResults();
    form.reset(emptyValues);
  };

  return (
    <SectionShell id="reservation">
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          eyebrow="RESERVATION"
          title="방문 상담을 예약하세요"
          description="학생 이름, 학년, 학부모 연락처, 희망 일시를 남겨 주시면 방문 상담을 접수합니다. 레벨 진단과 유형 진단 결과는 상담 내용에 함께 들어갑니다."
        />

        <div className={cn(neonCardClassName, 'p-6 md:p-8')}>
          {receipt ? (
            <div
              role="status"
              className="mb-6 rounded-2xl border border-primary-500/50 bg-primary-500/10 p-5"
            >
              <p className="font-semibold text-primary-400">방문 상담이 접수되었습니다.</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-200">
                {receipt.studentName} 학생 ({receipt.grade}) 상담을{' '}
                {formatConsultationTime(receipt.preferredDateTime)}에 요청했습니다. 확인 연락은{' '}
                {receipt.parentPhone}로 드립니다.
              </p>
              {receipt.levelTestResult || receipt.styleTestResult ? (
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                  진단 결과도 상담 내용에 함께 남겼습니다.
                </p>
              ) : null}
            </div>
          ) : null}

          <Form {...form}>
            <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              {submitError ? (
                <p role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                  {submitError}
                </p>
              ) : null}
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">학생 이름</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="홍길동"
                        autoComplete="name"
                        className={fieldClassName}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">학년</FormLabel>
                    <Select key={field.value ?? 'empty'} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder="학년을 선택해 주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-neutral-700 bg-neutral-800 text-neutral-100">
                        {GRADE_OPTIONS.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">학부모 연락처</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        inputMode="tel"
                        placeholder="010-0000-0000"
                        autoComplete="tel"
                        className={fieldClassName}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">희망 상담 일시</FormLabel>
                    <FormControl>
                      <Input {...field} type="datetime-local" className={fieldClassName} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="levelTestResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">레벨 진단 결과</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        readOnly
                        rows={Math.max(3, (field.value || '').split('\n').length)}
                        placeholder="레벨 진단을 마치면 추천 코스가 이 칸에 들어옵니다."
                        className={diagnosisFieldClassName}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="styleTestResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-200">유형 진단 결과</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        readOnly
                        rows={Math.max(3, (field.value || '').split('\n').length)}
                        placeholder="유형 진단을 마치면 학습 관여 스타일이 이 칸에 들어옵니다."
                        className={diagnosisFieldClassName}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={cn(neonButtonClassName, 'mt-2 w-full sm:w-auto')}
              >
                {form.formState.isSubmitting ? '접수 중...' : '상담 예약하기'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </SectionShell>
  );
}
