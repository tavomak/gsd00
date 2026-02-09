import { useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import useTranslation from 'next-translate/useTranslation';
import useNotify from '@/hooks/useNotify';
import Button from '@/components/Atoms/Button';
import Input from '@/components/Atoms/Input';

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation('common');
  const [notification] = useNotify();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (form) => {
    // eslint-disable-next-line no-console
    console.log({
      form,
      publicKey: process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY,
      email: process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID,
      template: process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE,
    });
    setLoading(true);
    try {
      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE,
        { ...form },
        {
          publicKey: process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY,
        }
      );
      if (response.status !== 200) throw new Error();
      notification('success', t('contact_success_message'));
    } catch (error) {
      notification('error', t('contact_error_message'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="px-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="name"
        text={t('contact_form_client_name')}
        placeholder={t('contact_form_client_name_placeholder')}
        rules={{
          required: t('contact_form_client_name_required'),
        }}
        errors={errors.name}
        register={register}
      />
      <Input
        type="email"
        name="email"
        text={t('contact_form_client_email')}
        placeholder={t('contact_form_client_email_placeholder')}
        rules={{
          required: t('contact_form_client_email_required'),
        }}
        register={register}
        errors={errors.email}
      />
      <label
        htmlFor="message"
        className="relative block px-4 pt-4 my-4 border-b border-gray-200 shadow-sm focus-within:border-primary-color focus-within:ring-1 focus-within:ring-primary-color"
      >
        <span className="block mb-8 text-2xl font-bold text-white">
          {t('contact_form_client_message')}
        </span>
        <textarea
          className="w-full bg-transparent focus:outline-none focus-visible:outline-none"
          rows="1"
          id="message"
          {...register('message')}
          placeholder={t('contact_form_client_message_placeholder')}
        />
      </label>
      <Button className="mt-10 btn btn-primary" loading={loading} submit>
        {t('contact_form_submit')}
      </Button>
    </form>
  );
};

export default ContactForm;
