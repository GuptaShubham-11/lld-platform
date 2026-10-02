'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { authSchema, AuthSchema } from '@/lib/validations/auth';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Spinner } from '../ui/spinner';
import { axiosInstance } from '@/lib/axios-instance';
import { toast } from '../ui/toast';
import { AxiosError } from 'axios';

export function AuthForm() {
  const authForm = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: { name: '', password: '' },
  });

  const { handleSubmit } = authForm;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const reducedMotion = useReducedMotion();

  const onSubmit = async (data: AuthSchema) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/v1/auth/register', data);
      localStorage.setItem('dL-user', JSON.stringify(response.data.data));

      toast.add({
        title: 'Your account has been created.',
        description: 'You can nown start solving problems.',
        type: 'success',
      });
    } catch (error) {
      const errMsg = error instanceof AxiosError && error.response?.data?.message;
      toast.add({
        type: 'error',
        title: 'Account has not been created.',
        description: errMsg || 'There was an error creating your account. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button size={'lg'} className="font-space-heading" />}>
        Start Solving Problems
      </PopoverTrigger>
      <PopoverContent className={'p-4'}>
        <AnimatePresence mode="popLayout">
          <motion.form
            key="form"
            id="auth-form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{
              opacity: 0,
              x: 8,
              y: 10,
              scale: 0.93,
              rotateX: -8,
              rotateY: 2,
              transformPerspective: 1200,
              filter: 'blur(10px)',
            }}

            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              filter: 'blur(0px)',
            }}

            exit={{
              opacity: 0,
              x: -5,
              y: -6,
              scale: 0.96,
              rotateX: 6,
              rotateY: -1,
              filter: 'blur(6px)',
            }}

            transition={{
              duration: reducedMotion ? 0 : 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col gap-2"
          >
            <h3 className="font-semibold font-space-heading text-foreground text-center text-lg">
              Start your design practice
            </h3>

            <FieldGroup>
              <Controller
                name="name"
                control={authForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-name" className="text-sm">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-name"
                      placeholder="Enter your username..."
                      autoComplete="off"
                      autoFocus
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={authForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-password" className="text-sm">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-password"
                      type="password"
                      placeholder="Enter your password..."
                      autoComplete="on"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button
              type="submit"
              size="lg"
              className="font-space-heading mt-4"
              disabled={isSubmitting}
              id="form-submit"
            >
              {isSubmitting ? (
                <>
                  <Spinner /> Continuing...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </motion.form>
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
