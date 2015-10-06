require 'net/http'

class Station < ActiveRecord::Base

  def endpoint
    'https://internal-tuner.pandora.com/services/json/?method=auth.partnerLogin'
  end

  def device_model
    'D01'
  end

  def username
    'pandora one'
  end

  def password
    'TVCKIBGS9AO9TSYLNNFUML0743LH82D'
  end

  def version
    '5'
  end

  def payload
    {
      :username => username,
      :password => password,
      :deviceModel => device_model,
      :version => version
    }.to_json
  end

  def uri
    URI(endpoint)
  end

  def header
    {'Content-Type' =>'application/json'}
  end

  def http
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http
  end

  def request
    req = Net::HTTP::Post.new(uri.path, initheader = header)
    req.body = payload
    req
  end

  def response
    res = http.request(request)
  end

end
