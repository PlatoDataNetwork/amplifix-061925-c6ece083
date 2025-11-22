-- Fix security vulnerabilities identified in security audit

-- 1. Fix translations table - drop permissive policy and add admin-only policies
DROP POLICY IF EXISTS "Authenticated users can manage translations" ON public.translations;

CREATE POLICY "Admins can insert translations" ON public.translations
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update translations" ON public.translations
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete translations" ON public.translations
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Add missing INSERT and DELETE policies for articles table
CREATE POLICY "Admins can insert articles" ON public.articles
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete articles" ON public.articles
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Add missing write policies for tags table
CREATE POLICY "Admins can insert tags" ON public.tags
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tags" ON public.tags
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tags" ON public.tags
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Add missing write policies for article_tags table
CREATE POLICY "Admins can insert article tags" ON public.article_tags
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update article tags" ON public.article_tags
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete article tags" ON public.article_tags
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));