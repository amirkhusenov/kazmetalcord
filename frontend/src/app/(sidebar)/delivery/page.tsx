import { City } from "@/components/geo/City";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import contacts from "@/contacts.json";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";

export default function DeliveryPage() {
  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-6">Условия доставки</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-gray-700 mb-4">
            Компания «KazMetalCord» осуществляет доставку металлопроката и металлоизделий по всей территории Республики
            Казахстан. Мы предлагаем различные варианты доставки, чтобы вы могли выбрать наиболее удобный и выгодный для
            вас способ получения заказа.
          </p>
          <p className="text-gray-700 mb-4">
            Наша логистическая сеть позволяет доставлять продукцию даже в самые отдаленные регионы страны. Мы
            гарантируем сохранность вашего груза и соблюдение всех сроков доставки.
          </p>
          <Alert className="bg-blue-50 border-blue-200 mt-6">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Важная информация</AlertTitle>
            <AlertDescription className="text-blue-600">
              Для уточнения стоимости и сроков доставки в ваш регион, пожалуйста, свяжитесь с нашими менеджерами по
              телефону {contacts.phone.text}
            </AlertDescription>
          </Alert>
        </div>
        <div className="relative w-full h-[300px]">
          <Image src="/hero.webp" alt="Доставка металлопроката" fill className="object-cover rounded-md" />
        </div>
      </div>

      {/* Delivery options */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Truck className="h-5 w-5 mr-2 text-blue-600" />
          Способы доставки
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2 flex items-center">
                <Truck className="h-4 w-4 mr-2 text-blue-600" />
                Доставка транспортом компании
              </h3>
              <p className="text-sm text-gray-600">
                Доставка осуществляется собственным автопарком компании. Мы имеем различные виды транспорта для
                перевозки металлопроката любых габаритов.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2 flex items-center">
                <Package className="h-4 w-4 mr-2 text-blue-600" />
                Самовывоз со склада
              </h3>
              <p className="text-sm text-gray-600">
                Вы можете самостоятельно забрать заказ с нашего склада. Эта опция позволяет сэкономить на доставке и
                получить товар в удобное для вас время.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2 flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
                Транспортные компании
              </h3>
              <p className="text-sm text-gray-600">
                Доставка через надежных партнеров-перевозчиков. Мы сотрудничаем с ведущими транспортными компаниями
                Казахстана для обеспечения качественной доставки.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delivery terms tabs */}
      <Tabs defaultValue="terms" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="terms">Условия доставки</TabsTrigger>
          <TabsTrigger value="regions">Регионы доставки</TabsTrigger>
          <TabsTrigger value="cost">Стоимость доставки</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            Сроки доставки
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Все города Казахстана: 1-2 рабочих дня</span>
            </li>
          </ul>

          <h3 className="font-medium mb-3 mt-6 flex items-center">
            <Package className="h-4 w-4 mr-2 text-blue-600" />
            Условия отгрузки
          </h3>
          <p className="mb-4">
            Отгрузка товара производится только после 100% оплаты заказа. При получении товара необходимо иметь при себе
            документ, удостоверяющий личность, и доверенность от организации (для юридических лиц).
          </p>
          <p>
            Перед отгрузкой вся продукция проходит проверку качества и соответствия заказу. Мы тщательно упаковываем
            металлопрокат для обеспечения его сохранности при транспортировке.
          </p>
        </TabsContent>

        <TabsContent value="regions" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
            Регионы доставки
          </h3>
          <p className="mb-4">Мы осуществляем доставку по всем регионам Республики Казахстан:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {Object.keys(contacts.address).map((city) => (
              <div className="flex items-center" key={city}>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>{city}</span>
              </div>
            ))}
          </div>

          <p className="mt-4">
            Также осуществляем доставку во все районные центры и отдаленные населенные пункты Казахстана.
          </p>
        </TabsContent>

        <TabsContent value="cost" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium mb-3 flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
            Стоимость доставки
          </h3>
          <p className="mb-4">Стоимость доставки рассчитывается индивидуально и зависит от следующих факторов:</p>

          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Вес и объем заказа</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Регион доставки</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Выбранный способ доставки</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>Необходимость использования специальной техники для разгрузки</span>
            </li>
          </ul>

          <Alert className="bg-green-50 border-green-200 mt-6">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Бесплатная доставка</AlertTitle>
            <AlertDescription className="text-green-600">
              При заказе на сумму от 1 000 000 тенге доставка по <City /> осуществляется бесплатно!
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Часто задаваемые вопросы</h2>
        <Separator className="mb-4" />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Как отслеживать статус моего заказа?</AccordionTrigger>
            <AccordionContent>
              После оформления заказа вам будет предоставлен уникальный номер для отслеживания. Вы можете узнать статус
              доставки, позвонив нашим менеджерам по телефону или через личный кабинет на нашем сайте.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Что делать, если товар пришел с повреждениями?</AccordionTrigger>
            <AccordionContent>
              При получении товара обязательно проверьте его качество и комплектность. В случае обнаружения повреждений
              или несоответствий, сразу же зафиксируйте их в акте приема-передачи и свяжитесь с нашим отделом доставки
              по телефону {contacts.phone.text}.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Какие документы нужны для получения заказа?</AccordionTrigger>
            <AccordionContent>
              Для физических лиц необходим документ, удостоверяющий личность. Для юридических лиц – доверенность от
              организации и документ, удостоверяющий личность получателя.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Осуществляете ли вы международную доставку?</AccordionTrigger>
            <AccordionContent>
              Да, мы осуществляем доставку в страны СНГ. Условия, сроки и стоимость международной доставки обсуждаются
              индивидуально. Для получения подробной информации свяжитесь с нашими менеджерами.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Contact for delivery */}
      <div>
        <h2 className="text-xl font-bold mb-4">Контакты отдела доставки</h2>
        <p className="text-gray-700 mb-4">
          Для уточнения деталей доставки, расчета стоимости или отслеживания статуса заказа вы можете связаться с
          отделом доставки:
        </p>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-blue-600" />
            <span className="text-gray-800">{contacts.phone.text} (доб. 2)</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-blue-600" />
            <span className="text-gray-800">{contacts.email.info}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-3 text-blue-600" />
            <span className="text-gray-800">Пн-Пт: 9:00 - 18:00, Сб: 9:00 - 14:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
