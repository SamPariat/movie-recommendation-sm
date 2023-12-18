import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useNavigation } from '@remix-run/react';
import { useRemixForm } from 'remix-hook-form';

import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { ReviewFormData, reviewFormSchema } from '~/types';

export const MovieReviewForm = () => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useRemixForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
  });

  const navigation = useNavigation();

  return (
    <>
      <Form
        className='space-y-2'
        method='post'
        onSubmit={handleSubmit}
      >
        <div className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-2 mb-2'>
          <Label htmlFor='review' className='text-lg'>
            Write Your Own Review
          </Label>
          <Textarea
            id='review'
            placeholder='Review...'
            {...register('review')}
          />
          <p className='text-xs font-semibold text-destructive'>
            {errors.review?.message}
          </p>
        </div>
        <Button
          size='sm'
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'submitting'
            ? 'Submitting Review....'
            : 'Submit Review'}
        </Button>
      </Form>

      <DevTool control={control} />
    </>
  );
};
