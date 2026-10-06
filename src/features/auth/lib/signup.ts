import { z } from 'zod';

const passwordByteLimit = 72;

const signupFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '이름을 입력해 주세요.')
    .max(50, '이름은 50자 이하로 입력해 주세요.'),
  loginId: z
    .string()
    .trim()
    .min(4, '아이디는 4자 이상이어야 합니다.')
    .max(30, '아이디는 30자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '아이디는 영문, 숫자, 밑줄만 사용할 수 있습니다.'),
  email: z.string().trim().email('올바른 이메일을 입력해 주세요.'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .refine(
      (value) => new TextEncoder().encode(value).length <= passwordByteLimit,
      '비밀번호가 너무 깁니다.',
    ),
  passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
});

export const signupSchema = signupFieldsSchema.refine(
  (value) => value.password === value.passwordConfirm,
  {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  },
);

export const signupRequestSchema = signupFieldsSchema.omit({ passwordConfirm: true });

export type SignupFormValues = z.infer<typeof signupSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
