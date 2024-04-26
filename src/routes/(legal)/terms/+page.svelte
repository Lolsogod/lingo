<script lang="ts">
	import {
		TERMS_PRIVACY_APP_NAME,
		TERMS_PRIVACY_APP_PRICING_AND_SUBSCRIPTIONS,
		TERMS_PRIVACY_COMPANY,
		TERMS_PRIVACY_CONTACT_EMAIL,
		TERMS_PRIVACY_COUNTRY,
		TERMS_PRIVACY_EFFECTIVE_DATE
	} from '$lib/config/constants';
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			Условия и положения для {TERMS_PRIVACY_APP_NAME}
		</h1>

		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Дата вступления в силу: {TERMS_PRIVACY_EFFECTIVE_DATE}
		</h4>

		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Принятие условий
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Пользуясь сервисом {TERMS_PRIVACY_APP_NAME}, вы принимаете и соглашаетесь с условиями и
			положениями данного соглашения.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Изменение условий
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Мы оставляем за собой право по своему усмотрению вносить изменения в настоящие Условия
			обслуживания в любое время и будем обновлять их в случае таких изменений.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Аккаунт и доступ
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Для доступа и использования нашего сервиса вам может потребоваться зарегистрироваться у нас и
			создать аккаунт с использованием вашего адреса электронной почты и пароля. Вы полностью несете
			ответственность за сохранение конфиденциальности вашего аккаунта и пароля, а также за все
			действия, связанные с вашим аккаунтом.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Ваши обязанности
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Вы несете ответственность за все содержимое, которое вы загружаете, публикуете, отправляете по
			электронной почте или иным образом передаете через сервис. Вы соглашаетесь соблюдать все
			применимые законы и правила, касающиеся использования сервиса.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Оплата и сборы
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			{TERMS_PRIVACY_APP_PRICING_AND_SUBSCRIPTIONS}
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Интеллектуальная собственность
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Сервис и его оригинальное содержимое, функции и функциональность являются и останутся
			исключительной собственностью {TERMS_PRIVACY_COMPANY}. Сервис защищен авторским правом,
			товарными знаками и другими законами как {TERMS_PRIVACY_COUNTRY}, так и иностранных стран.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Прекращение
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Мы можем немедленно прекратить или приостановить ваш доступ к сервису без предварительного
			уведомления или ответственности по нашему собственному усмотрению по любой причине и без
			ограничений, включая, но не ограничиваясь, нарушение условий.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Ограничение ответственности
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			В никаком случае {TERMS_PRIVACY_COMPANY}, а также его директоры, сотрудники, партнеры, агенты,
			поставщики или аффилированные лица не несут ответственности за косвенные, случайные,
			специальные, косвенные или карательные убытки, включая, но не ограничиваясь, упущенную выгоду,
			потерю данных, использование, добро или другие нематериальные потери, возникающие из доступа к
			сервису или его использования или невозможности доступа или использования сервиса.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Применимое право
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Настоящие Условия регулируются и толкуются в соответствии с законами {TERMS_PRIVACY_COUNTRY},
			без применения принципов коллизии законов.
		</p>
		<h4 class="mt-3 text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
			Свяжитесь с нами
		</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Если у вас есть вопросы по поводу настоящих Условий, пожалуйста, свяжитесь с нами по адресу {TERMS_PRIVACY_CONTACT_EMAIL}.
		</p>
	</div>
</section>
