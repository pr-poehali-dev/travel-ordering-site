import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

// База городов с расстояниями (км)
const cityDistances: Record<string, Record<string, number>> = {
  'Москва': {
    'Санкт-Петербург': 635,
    'Казань': 719,
    'Нижний Новгород': 411,
    'Воронеж': 463,
    'Ростов-на-Дону': 1067,
    'Екатеринбург': 1416,
    'Новосибирск': 3303,
    'Краснодар': 1200
  },
  'Санкт-Петербург': {
    'Москва': 635,
    'Новгород': 180,
    'Псков': 280,
    'Мурманск': 1005,
    'Архангельск': 1133
  },
  'Казань': {
    'Москва': 719,
    'Уфа': 525,
    'Самара': 340,
    'Пермь': 723,
    'Екатеринбург': 756
  },
  'Нижний Новгород': {
    'Москва': 411,
    'Казань': 396,
    'Киров': 385,
    'Владимир': 230
  }
};

// Тарифы за км
const tariffRates = {
  'economy': 8, // руб за км
  'comfort': 12,
  'vip': 18
};

export default function Index() {
  const [bookingForm, setBookingForm] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    passengers: '1',
    tariff: 'comfort',
    comments: ''
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Функция расчета расстояния
  const calculateDistance = (from: string, to: string): number | null => {
    if (!from || !to || from === to) return null;
    
    // Прямое расстояние
    if (cityDistances[from]?.[to]) {
      return cityDistances[from][to];
    }
    
    // Обратное расстояние
    if (cityDistances[to]?.[from]) {
      return cityDistances[to][from];
    }
    
    return null;
  };

  // Автоматический расчет стоимости
  useEffect(() => {
    const dist = calculateDistance(bookingForm.from, bookingForm.to);
    setDistance(dist);
    
    if (dist && bookingForm.tariff) {
      const rate = tariffRates[bookingForm.tariff as keyof typeof tariffRates];
      const basePrice = dist * rate;
      const totalPrice = basePrice * parseInt(bookingForm.passengers);
      setCalculatedPrice(totalPrice);
    } else {
      setCalculatedPrice(null);
    }
  }, [bookingForm.from, bookingForm.to, bookingForm.tariff, bookingForm.passengers]);

  // Получение списка доступных городов
  const getAvailableCities = () => {
    const cities = new Set<string>();
    Object.keys(cityDistances).forEach(city => cities.add(city));
    Object.values(cityDistances).forEach(destinations => {
      Object.keys(destinations).forEach(city => cities.add(city));
    });
    return Array.from(cities).sort();
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = calculatedPrice ? ` Стоимость: ${calculatedPrice}₽` : '';
    alert(`Заявка отправлена!${price} Мы свяжемся с вами в ближайшее время.`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Bus" className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">ТревелТрекс</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#home" className="text-gray-700 hover:text-primary transition-colors">Главная</a>
              <a href="#services" className="text-gray-700 hover:text-primary transition-colors">Услуги</a>
              <a href="#booking" className="text-gray-700 hover:text-primary transition-colors">Заказ</a>
              <a href="#tariffs" className="text-gray-700 hover:text-primary transition-colors">Тарифы</a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">О компании</a>
              <a href="#contacts" className="text-gray-700 hover:text-primary transition-colors">Контакты</a>
            </div>
            <Button variant="outline" className="md:hidden">
              <Icon name="Menu" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">Надежные пассажирские перевозки</h2>
            <p className="text-xl mb-8 text-blue-100">
              Комфортабельные автобусы, опытные водители, пунктуальность и безопасность - ваш выбор для деловых и личных поездок
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                <Icon name="Calendar" className="mr-2" />
                Забронировать поездку
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Icon name="Phone" className="mr-2" />
                +7 (495) 123-45-67
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Онлайн бронирование</h3>
              <p className="text-gray-600">Быстро и удобно забронируйте поездку</p>
            </div>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="MapPin" className="mr-2 text-primary" />
                  Заказать поездку
                </CardTitle>
                <CardDescription>
                  Заполните форму, и мы подберем оптимальный маршрут
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="from">Откуда</Label>
                      <Select onValueChange={(value) => setBookingForm({...bookingForm, from: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите город отправления" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableCities().map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to">Куда</Label>
                      <Select onValueChange={(value) => setBookingForm({...bookingForm, to: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите город назначения" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableCities().map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Дата поездки</Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Время отправления</Label>
                      <Select onValueChange={(value) => setBookingForm({...bookingForm, time: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">06:00</SelectItem>
                          <SelectItem value="08:00">08:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="12:00">12:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                          <SelectItem value="18:00">18:00</SelectItem>
                          <SelectItem value="20:00">20:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passengers">Количество пассажиров</Label>
                      <Select onValueChange={(value) => setBookingForm({...bookingForm, passengers: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="1" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(50)].map((_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tariff">Тариф</Label>
                      <Select onValueChange={(value) => setBookingForm({...bookingForm, tariff: value})} defaultValue="comfort">
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тариф" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economy">Эконом ({tariffRates.economy}₽/км)</SelectItem>
                          <SelectItem value="comfort">Комфорт ({tariffRates.comfort}₽/км)</SelectItem>
                          <SelectItem value="vip">VIP ({tariffRates.vip}₽/км)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Калькулятор стоимости */}
                  {(distance || calculatedPrice) && (
                    <Card className="bg-blue-50 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold flex items-center">
                            <Icon name="Calculator" className="mr-2 text-primary" />
                            Расчет стоимости
                          </h4>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Автоматический расчет
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          {distance && (
                            <div className="flex items-center">
                              <Icon name="Route" className="h-4 w-4 text-gray-500 mr-2" />
                              <span>Расстояние: <strong>{distance} км</strong></span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Icon name="Users" className="h-4 w-4 text-gray-500 mr-2" />
                            <span>Пассажиров: <strong>{bookingForm.passengers}</strong></span>
                          </div>
                          <div className="flex items-center">
                            <Icon name="Tag" className="h-4 w-4 text-gray-500 mr-2" />
                            <span>Тариф: <strong>{bookingForm.tariff === 'economy' ? 'Эконом' : bookingForm.tariff === 'comfort' ? 'Комфорт' : 'VIP'}</strong></span>
                          </div>
                        </div>
                        {calculatedPrice && (
                          <div className="mt-4 p-4 bg-white rounded-lg border">
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold">Общая стоимость:</span>
                              <span className="text-2xl font-bold text-primary">{calculatedPrice.toLocaleString()}₽</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {distance} км × {tariffRates[bookingForm.tariff as keyof typeof tariffRates]}₽/км × {bookingForm.passengers} пас.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="comments">Дополнительные пожелания</Label>
                    <Textarea
                      id="comments"
                      placeholder="Укажите особые требования к поездке"
                      value={bookingForm.comments}
                      onChange={(e) => setBookingForm({...bookingForm, comments: e.target.value})}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Icon name="Send" className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Наши услуги</h3>
            <p className="text-gray-600">Широкий спектр транспортных решений</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Icon name="Users" className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Групповые перевозки</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Организация поездок для корпоративных мероприятий, экскурсий и делегаций
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Icon name="Clock" className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Регулярные рейсы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ежедневные маршруты по популярным направлениям с гарантированным расписанием
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Icon name="Car" className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Индивидуальные заказы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Персональные поездки с учетом ваших требований к маршруту и времени
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tariffs */}
      <section id="tariffs" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Тарифы</h3>
            <p className="text-gray-600">Прозрачное ценообразование без скрытых платежей</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Эконом</CardTitle>
                <CardDescription>Оптимальное соотношение цены и качества</CardDescription>
                <div className="text-3xl font-bold text-primary">от 500₽</div>
                <p className="text-sm text-gray-500">за человека</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Комфортабельные автобусы</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Опытные водители</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Страхование пассажиров</span>
                </div>
                <Button className="w-full mt-6" variant="outline">Выбрать тариф</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-lg scale-105">
              <CardHeader className="text-center bg-primary text-white rounded-t-lg">
                <CardTitle className="text-2xl">Комфорт</CardTitle>
                <CardDescription className="text-blue-100">Популярный выбор</CardDescription>
                <div className="text-3xl font-bold">от 800₽</div>
                <p className="text-sm text-blue-100">за человека</p>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Автобусы повышенной комфортности</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Wi-Fi и кондиционер</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Прохладительные напитки</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Приоритетная поддержка</span>
                </div>
                <Button className="w-full mt-6">Выбрать тариф</Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">VIP</CardTitle>
                <CardDescription>Премиальный сервис</CardDescription>
                <div className="text-3xl font-bold text-primary">от 1200₽</div>
                <p className="text-sm text-gray-500">за человека</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Микроавтобусы Mercedes</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Индивидуальный подход</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>Встреча с табличкой</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Check" className="h-5 w-5 text-green-500 mr-2" />
                  <span>24/7 поддержка</span>
                </div>
                <Button className="w-full mt-6" variant="outline">Выбрать тариф</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">О компании</h3>
              <p className="text-gray-600">Надежный партнер в сфере пассажирских перевозок</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/img/f2cbba24-438c-430d-945d-b2efadb1d392.jpg" 
                  alt="Автобус ТревелТрекс" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="space-y-6">
                <h4 className="text-2xl font-semibold text-gray-900">15 лет безупречной работы</h4>
                <p className="text-gray-600">
                  ТревелТрекс — это команда профессионалов, которая уже более 15 лет предоставляет 
                  качественные услуги пассажирских перевозок. Мы гордимся нашей безупречной репутацией 
                  и доверием тысяч клиентов.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">50+</div>
                    <p className="text-gray-600">Автобусов в парке</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">100K+</div>
                    <p className="text-gray-600">Довольных клиентов</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Icon name="Shield" className="h-8 w-8 text-primary" />
                  <div>
                    <h5 className="font-semibold">Лицензированная деятельность</h5>
                    <p className="text-gray-600 text-sm">Все необходимые разрешения и страхование</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Контакты</h3>
            <p className="text-gray-600">Свяжитесь с нами удобным способом</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <Icon name="Phone" className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Телефон</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-primary">+7 (495) 123-45-67</p>
                <p className="text-gray-600 mt-2">Круглосуточно</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Icon name="Mail" className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-primary">info@traveltracks.ru</p>
                <p className="text-gray-600 mt-2">Ответим в течение часа</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Icon name="MapPin" className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Адрес</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">Москва</p>
                <p className="text-gray-600 mt-2">ул. Транспортная, 15</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Icon name="Bus" className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ТревелТрекс</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© 2024 ТревелТрекс. Все права защищены.</p>
              <p className="text-gray-400 text-sm mt-1">Лицензия на перевозки №12345</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}